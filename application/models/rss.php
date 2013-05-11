<?php

class RSS {

	public static function update () {
		$feeds = Source::get();
		$countItems = 0;
		@set_time_limit(5000);
		foreach ($feeds as $feed) $countItems += self::update_feed($feed);

		return count($feeds).' feeds updated with '.$countItems.' new items';
	}

	public static function update_feed ($item) {
		$pie = new SimplePie();
		$pie->set_cache_location(path('storage').'simplepie');
		$pie->set_cache_duration(1800);
		$pie->set_feed_url($item->url);
		$pie->force_feed(true);
		$pie->init();

		$items = 0;
		$src = [ 'last_error' => '' ];

		if ($pie->error()) {
			$src['last_error'] = $pie->error();
		}
		else {
			$feeds = $pie->get_items();
			foreach ($feeds as $feed) {
				$items += Item::add([
					'user_id' => 1,
					'source_id' => $item->id,
					'item_id' => $feed->get_id(),
					'datetime' => $feed->get_date('Y-m-d H:i:s'),
					'title' => $feed->get_title(),
					'content' => $feed->get_content(),
					'url' => $feed->get_link()
				]);
			}

			if (empty($item->real_url)) {
				$item->real_url = static::get_real_url($feed->get_link());
				$src['real_url'] = $item->real_url;
			}

			$src['icon'] = static::get_icon($item);
		}

		Source::update($item->id, (object)$src);

		return $items;
	}

	//http://www.google.com/s2/favicons?domain=nettuts.com
	//https://plus.google.com/_/favicon?domain=http://feeds.feedburner.com/CssTricks
	public static function get_icon ($item) {
		$iconUrl = 'https://plus.google.com/_/favicon?domain=' . $item->real_url;
		$file = path('storage').'/favicons/'.$item->id.'.png';
		$tooOld = isset($item->icon) && ($item->icon + 604800 < time());
		$noImg = !file_exists($file);

		if (empty($item->icon) || $tooOld || $noImg) {  // if no icon or icon older than a week - fetch new one
			copy($iconUrl, $file);
			return time();
		}
		return null;
	}


	public static function get_real_url ($url) {
		$ch = curl_init($url);
		curl_setopt_array($ch, [
			CURLOPT_RETURNTRANSFER => true,      // return web page
			CURLOPT_HEADER         => true,      // do not return headers
			CURLOPT_FOLLOWLOCATION => false,     // follow redirects
			CURLOPT_USERAGENT      => "spider",  // who am i
			CURLOPT_AUTOREFERER    => true,      // set referer on redirect
			CURLOPT_CONNECTTIMEOUT => 120,       // timeout on connect
			CURLOPT_TIMEOUT        => 120,       // timeout on response
			CURLOPT_MAXREDIRS      => 10         // stop after 10 redirects
		]);
		$a = curl_exec($ch);
		curl_close($ch);
		if (preg_match('#Location: (.*)#', $a, $r)) $url = trim($r[1]);
		return parse_url($url)['host'];                // get domain from url
	}

}

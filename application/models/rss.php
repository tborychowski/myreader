<?php

class RSS {

	// htmLawed config
	static $hlConf = [
		'safe'           => 1,
		'keep_bad'       => 0,
		'comment'        => 1,
		'cdata'          => 1,
		'deny_attribute' => '* -alt -title -src -href',
		'elements'       => 'div,p,ul,li,a,img,dl,dt,h1,h2,h3,h4,h5,h6,ol,br,table,tr,td,blockquote,pre,ins,del,th,thead,tbody,b,i,strong,em,tt'
	];

	static $ageLimit = 3456000; // 86400 * 40 -> 40 days ago



	/**
	 * MAIN UPDATE
	 * @param  int $user_id    id of the user or null
	 * @return object          update stats
	 */
	public static function update ($user_id) {
		if (!isset($user_id)) $feeds = Source::all();
		else $feeds = Source::where_user_id($user_id)->get();

		$countItems = 0;
		$removedItems = 0;
		@set_time_limit(10000);

		foreach ($feeds as $feed) $countItems += self::update_feed($feed);
		foreach ($feeds as $feed) $removedItems += self::clean_feed($feed);

		return [
			'result' => 'success',
			'feeds' => count($feeds),
			'items' => $countItems,
			'removed' => $removedItems
		];
	}




	public static function update_feed ($item) {
		$notOlderThan = date('U', time() - static::$ageLimit);

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

			$feedUrl = '';
			foreach ($feeds as $feed) {
				$feedUrl = $feed->get_link();
				if ($feed->get_date('U') >= $notOlderThan) {
					$items += Item::add([
						'user_id' => $item->user_id,
						'source_id' => $item->id,
						'item_id' => $feed->get_id(),
						'datetime' => $feed->get_date('Y-m-d H:i:s'),
						'title' => $feed->get_title(),
						'content' => htmLawed::hl($feed->get_description(), static::$hlConf),	// get summary only
						//'content' => htmLawed::hl($feed->get_content(), static::$hlConf),
						'url' => $feedUrl
					]);
				}
			}

			if (empty($item->real_url)) {
				$lnk = $feedUrl;
				if (!$lnk) $lnk = $item->url;
				$item->real_url = static::get_real_url($lnk);
				$src['real_url'] = $item->real_url;
			}
			$src['icon'] = static::get_icon($item);
		}

		Source::update($item->id, (object)$src);

		return $items;
	}



	/**
	 * Clean-up feed - remove old items
	 * @return int          number of items removed
	 */
	public static function clean_feed ($item) {
		$notOlderThan = date('Y-m-d G:i:s', time() - static::$ageLimit);

		//Source::update($item->id, (object)$src);
		$items = Item::where_user_id($item->user_id)->where_source_id($item->id);
		$items = $items->where('created_at', '<', $notOlderThan);
		$items = $items->where('is_starred', '=', 0);
		$items = $items->where('is_unread', '=', 0);
		$count = count($items->get());
		$items->delete();
		return $count;
	}





	//http://www.google.com/s2/favicons?domain=nettuts.com
	//https://plus.google.com/_/favicon?domain=http://feeds.feedburner.com/CssTricks
	public static function get_icon ($item) {
		$iconUrl = 'https://plus.google.com/_/favicon?domain=' . $item->real_url;
		$file = path('public').'/img/favicons/'.$item->id.'.png';
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
		if (preg_match('#Location: (.*)#', $a, $r)) $url2 = trim($r[1]);

		if (isset($url2)) {
			$parse = parse_url($url2);
			if (isset($parse['host'])) return $parse['host'];       // get domain from url
		}

		$parse = parse_url($url);
		if (isset($parse['host'])) return $parse['host'];       // get domain from original url

		return $url;
	}

}

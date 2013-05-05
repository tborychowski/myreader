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

		if ($pie->error()) die($pie->error());		// cancel id errors

		$feeds = $pie->get_items();

		$items = 0;
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
		return $items;
	}

}

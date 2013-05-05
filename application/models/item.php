<?php

class Item extends Eloquent {

	public static $rules = array( 'item_id'  => 'required|unique:items'	);

	public function source () {	return $this->belongs_to('Source');	}



	public static function stats () {
		return [
			'unread' => Item::where_is_unread(1)->count(),
			'starred' => Item::where_is_starred(1)->count(),
			'all' => Item::count()
		];
	}

	/**
	 * Retrieve unread counts in an object format
	 * @return object  { id: unreadNumber }
	 */
	public static function get_unread_counts () {
		$items = Item::group_by('source_id')->get([ 'source_id AS id', DB::raw('count(items.id) AS unread') ]);
		$unreads = [];
		foreach ($items as $item) {
			if (!isset($unreads[$item->id])) $unreads[$item->id] = 1;
			else $unreads[$item->id]++;
		}
		return $unreads;
	}



	public static function get_unread () {
		$items = Item::with('source')->where_is_unread(1)->get();

		return array_map(function($item) {
			$item2 = $item->to_array();
			unset($item2['source']['user_id'], $item2['source']['created_at'], $item2['source']['updated_at']);
			return $item2;
		}, $items);
	}

	public static function get_starred () {
		$items = Item::with('source')->where_is_starred(1)->get();

		return array_map(function($item) {
			$item2 = $item->to_array();
			$item2['source_name'] = $item->source->name;
			return $item2;
		}, $items);
	}

	public static function get ($id = null) {
		if (isset($id)) return Item::find($id);
		$items = Item::with('source')->all();

		return array_map(function($item) {
			$item2 = $item->to_array();
			$item2['source_name'] = $item->source->name;
			return $item2;
		}, $items);
	}


	/**
	 * Add items from "update" route
	 * @param array $item item data
	 * @return int 1 if success, 0 if error
	 */
	public static function add ($item) {
		if (!$item) return;
		$validation = Validator::make($item, static::$rules);
		if ($validation->fails()) return 0;
		return Item::create($item) ? 1 : 0;
	}


	public static function update ($id = null, $input) {
		if (!$id) return JSON::error('Item ID is missing');

		$item = Item::find($id);
		if (!$item) return JSON::error('Item not found');

		if (isset($input->is_unread)) $item->is_unread = $input->is_unread;
		if (isset($input->is_starred)) $item->is_starred = $input->is_starred;
		$item->save();

		return JSON::success('Item was updated');
	}


	public static function del ($id = null) {
		if (!$id) return JSON::error('Item ID is missing');

		$item = Item::find($id);
		if (!$item) return JSON::error('Item not found');

		$item->delete();
		return JSON::success('Item was removed');
	}

}

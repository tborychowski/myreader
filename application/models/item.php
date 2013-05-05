<?php

class Item extends Eloquent {


	public static $rules = array(
		'item_id'  => 'required|unique:items'
	);

	public function source () {
		return $this->belongs_to('Source');
	}

	public static function stats () {
		return [
			'unread' => Item::where_is_unread(1)->count(),
			'starred' => Item::where_is_starred(1)->count(),
			'all' => Item::count()
		];
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

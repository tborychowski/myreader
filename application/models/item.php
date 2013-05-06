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
	 * Retrieve unread counts in an object format (for sidebar feed tree)
	 * @return object  { id: unreadNumber }
	 */
	public static function get_unread_counts ($status = 'archive', $type = 'all', $id = '') {
		$items = Item::group_by('source_id');

		if ($type === 'tag' && isset($id)) {
			$tag = Source::where_tag($id)->first('id');
			if ($tag) $id = $tag->id;
		}
		if ($type !== 'all' && !empty($id)) $items = $items->where_source_id($id);

		if ($status === 'unread') $items = $items->where_is_unread(1);
		elseif ($status === 'starred') $items = $items->where_is_starred(1);

		$items = $items->get([ 'source_id AS id', DB::raw('count(items.id) AS unread') ]);

		$unreads = [];
		foreach ($items as $item) {
			if (!isset($unreads[$item->id])) $unreads[$item->id] = 0;
			$unreads[$item->id] += $item->unread;
		}

		return $unreads;
	}



	public static function get ($status = 'archive', $type = 'all', $id = '') {
		$items = Item::with('source');

		if ($type === 'tag' && isset($id)) {
			$tag = Source::where_tag($id)->first('id');
			if ($tag) $id = $tag->id;
		}
		if ($type !== 'all' && !empty($id)) $items = $items->where_source_id($id);

		if ($status === 'unread') $items = $items->where_is_unread(1);
		elseif ($status === 'starred') $items = $items->where_is_starred(1);

		if (method_exists($items, 'all')) $items = $items->all();
		else $items = $items->get();

		return array_map(function ($item) {
			unset($item->source->user_id, $item->source->created_at, $item->source->updated_at);
			return $item;
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

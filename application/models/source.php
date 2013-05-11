<?php

class Source extends Eloquent {


	public static $rules = array(
		'name'  => 'required|alpha_num|unique:sources',
		'url'  => 'required|url|unique:sources'
	);

	public function items () {
		return $this->has_many('Item');
	}


	public static function get_tree ($status = 'archive', $type = 'all', $id = '') {
		$sources = Source::all();
		$unreads = Item::get_unread_counts($status);				// retreieve all items with unread counters

		$tags = [];
		foreach ($sources as $src) {								// start with array of named objects
			$tag = $src->tag ? $src->tag : '';
			unset($src->user_id, $src->created_at, $src->updated_at, $src->tag);
			$src->unread = isset($unreads[$src->id]) ? $unreads[$src->id] : 0;

			if (!isset($tags[$tag])) $tags[$tag] = [ 'name' => $tag, 'unread' => 0, 'items' => [] ];
			$tags[$tag]['unread'] += $src->unread;
			$tags[$tag]['items'][] = $src->to_array();
		}

		$items = [];
		foreach ($tags as $tag) $items[] = $tag;					// convert to array of objects
		return $items;
	}



	public static function get ($id = null) {
		if (isset($id)) return Source::find($id);
		return Source::all();
	}



	public static function add ($input) {
		if (!$input) return JSON::error('Incorrect parameters');

		$validation = Validator::make($input, static::$rules);
		if ($validation->fails()) return JSON::error($validation->errors->first());

		$item = array('name' => $input['name'], 'url' => $input['url']);
		if (isset($input['tag'])) $item['tag'] = $input['tag']; else $item['tag'] = '';

		return Source::create($item);
	}


	public static function update ($id = null, $input) {
		if (!$id) return JSON::error('Item ID is missing');

		$item = Source::find($id);
		if (!$item) return JSON::error('Item not found');

		if (isset($input->name)) $item->name = $input->name;
		if (isset($input->url)) $item->url = $input->url;
		if (isset($input->real_url)) $item->real_url = $input->real_url;
		if (isset($input->icon)) $item->icon = $input->icon;
		if (isset($input->last_error)) $item->last_error = $input->last_error;

		$item->updated_at = new \DateTime;
		$item->save();

		return JSON::success('Item was updated');
	}


	public static function del ($id = null) {
		if (!$id) return JSON::error('Item ID is missing');

		$item = Source::find($id);
		if (!$item) return JSON::error('Item not found');

		$item->items()->delete();
		$item->delete();
		return JSON::success('Item was removed');
	}

}

<?php

class Source extends Eloquent {


	public static $rules = array(
		'name'  => 'required|alpha_num|unique:sources',
		'url'  => 'required|url|unique:sources'
	);

	public function items () {
		return $this->has_many('Item');
	}


	public static function get_unread () {
		// retreieve all items with unread counters
		$items = Item::where_is_unread(1)
			->left_join('sources', 'sources.id', '=', 'items.source_id')
			->group_by('source_id')
			->get([ 'sources.*', DB::raw('count(items.id) AS unread') ]);
		return $items;
	}

	public static function get ($id = null) {
		if (isset($id)) return Source::find($id);
		else return Source::all();
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

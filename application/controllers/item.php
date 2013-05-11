<?php

class Item_Controller extends Base_Controller {
	public $restful = true;


	/**
	 * Retrieve counters: unread, starred, all
	 */
	public function get_stats () { return Item::stats(); }


	/**
	 * Retrieve a list of items or a single item
	 * @param  int $id
	 */
	public function get_index ($id = null) {
		if (isset($id)) return Item::find($id);
		return Item::get(Input::get());
	}

	/**
	 * Can't create new items
	 */
	public function post_index () { return JSON::error('You cannot create new items'); }

	/**
	 * Update item
	 */
	public function put_index ($id = null) {
		if (isset($id)) return Item::update($id, Input::json());

		$items = Item::get(Input::get(), false);
		return Item::update_all($items, Input::json());
	}

	/**
	 * Delete item
	 */
	public function delete_index ($id = null) { return Item::del($id); }


}
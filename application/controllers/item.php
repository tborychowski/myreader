<?php

class Item_Controller extends Base_Controller {
	public $restful = true;


	/**
	 * Retrieve counters: unread, starred, all
	 */
	public function get_stats () { return Item::stats(); }


	public function get_unread_tag ($tag) {
		return Item::get_unread();
	}
	public function get_unread_src ($id) {
		return Item::get_unread();
	}
	public function get_unread_all () {
		return Item::get_unread();
	}



	public function get_starred () {
		return Item::get_starred();
	}

	public function get_all () {
		return Item::get();
	}


	/**
	 * Retrieve a list of items or a single item
	 * @param  int $id
	 */
	public function get_index ($id = null) { return Item::get($id); }

	/**
	 * Can't create new items
	 */
	public function post_index () { return JSON::error('You cannot create new items'); }

	/**
	 * Update item
	 */
	public function put_index ($id = null) { return Item::update($id, Input::json()); }

	/**
	 * Delete item
	 */
	public function delete_index ($id = null) { return Item::del($id); }


}
<?php

class Item_Controller extends Base_Controller {
	public $restful = true;


	/**
	 * Retrieve counters: unread, starred, all
	 */
	public function get_stats () { return Item::stats(); }



	/**
	 * Retrieve a list of items or a single item
	 * or: mark item as read/unread/starred/unstarred
	 * @param  int $id
	 */
	public function get_index ($id = null, $type = null) {
		if (isset($type)) {
			$item = [];
			if ($type === 'read') $item['is_unread'] = 0;
			elseif ($type === 'unread') $item['is_unread'] = 1;
			elseif ($type === 'unstar') $item['is_starred'] = 0;
			elseif ($type === 'star') $item['is_starred'] = 1;
			else return JSON::error('Incorrect URI');

			return Item::update($id, (object) $item);
		}
		else return Item::get($id);
	}

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
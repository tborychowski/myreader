<?php

class Source_Controller extends Base_Controller {
	public $restful = true;

	/**
	 * Retrieve a list of items or a single item
	 */
	public function get_index ($id = null) { return Source::get($id); }

	/**
	 * Create a new item
	 */
	public function post_index () { return Source::add(Input::json(true)); }

	/**
	 * Update item
	 */
	public function put_index ($id = null) { return Source::update($id, Input::json()); }

	/**
	 * Delete item
	 */
	public function delete_index ($id = null) { return Source::del($id); }


}
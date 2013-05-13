<?php

class Source_Controller extends Base_Controller {
	public $restful = true;

	/**
	 * Update all sources
	 */
	public function get_update ($email = null) {
		if (isset($email)) $user = User::where_email($email)->first();
		else $user = Auth::user();
		if (!$user) return Response::error('404', [ 'message' => 'User Not Found' ]);
		//if (!$user) return JSON::error('User not found');
		return RSS::update($user->id);
	}

	/**
	 * Retrieve a source tree with counters
	 */
	public function get_tree () {
		$inp = Input::get();

		$status = isset($inp['status']) ? $inp['status'] : 'archive';
		if (isset($inp['tag'])) {
			$type = 'tag';
			$id = $inp['tag'];
		}
		elseif (isset($inp['src'])) {
			$type = 'src';
			$id = $inp['src'];
		}
		else {
			$type = 'all';
			$id = '';
		}

		return Source::get_tree($status, $type, $id);
	}


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
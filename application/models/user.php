<?php

class User extends Eloquent {
	public static $hidden = [ 'password' ];


	public static $rules = array(																								// Validation rules
		'email'  => 'required|unique:users'
	);

	public static function get ($id = null) {
		if (!isset($id)) return User::order_by('id')->get();		// return all users

		$user = User::find($id);
		if ($user) return $user;
		return JSON::error('User not found');
	}


	public static function add ($input) {
		if (!$input) return JSON::error('Missing parameters');

		$validation = Validator::make($input, static::$rules);
		if ($validation->fails()) return $validation;

		$user = array('email' => $input['email']);
		if (isset($input['password'])) $user['password'] = $input['password'];
		else $user['password'] = '';

		$user['password'] = Hash::make($user['password']);
		if (User::create($user)) return true;
		return false;
	}


	public static function update ($id = null, $input) {
		if (!$id) return 'User ID is missing';

		$user = User::find($id);
		if (!$user) return 'User not found';

		if (isset($input->email)) $user->email = $input->email;
		if (isset($input->password)) $user->password = Hash::make($input->password);
		$user->save();

		return true;
	}


	public static function del ($id = null) {
		if (!$id) return 'User ID is missing';

		$user = User::find($id);
		if (!$user) return 'User not found';

		Item::where_user_id($id)->delete();
		Source::where_user_id($id)->delete();
		$user->delete();

		return true;
	}

}
<?php

class User extends Eloquent {
	public static $hidden = [ 'password' ];


	public static $rules = array(																								// Validation rules
		'email'  => 'email|required|unique:users'
	);

	public static function get ($id = null) {
		if (!isset($id)) return User::order_by('email')->get();		// return all users

		$user = User::find($id);
		if ($user) return $user;
		return JSON::error('User not found');
	}


	public static function add ($input) {
		if (!$input) return JSON::error('Missing parameters');

		$validation = Validator::make($input, static::$rules);
		if ($validation->fails()) return JSON::error($validation->errors->first());

		$user = array('email' => $input['email']);
		if (isset($input['password'])) $user['password'] = $input['password'];      else $user['password'] = '';
		$user['password'] = Hash::make($user['password']);

		return User::create($user);
	}


	public static function update ($id = null, $input) {
		if (!$id) return JSON::error('User ID is missing');

		$user = User::find($id);
		if (!$user) return JSON::error('User not found');

		if (isset($input->email)) $user->email = $input->email;
		if (isset($input->password)) $user->password = Hash::make($input->password);
		$user->save();

		return JSON::success('User was updated');
	}


	public static function del ($id = null) {
		if (!$id) return JSON::error('User ID is missing');

		$user = User::find($id);
		if (!$user) return JSON::error('User not found');

		$user->delete();
		return JSON::success('User was removed');
	}

}
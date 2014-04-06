<?php

class Admin_Controller extends Base_Controller {

	private static $login = 'admin';
	private static $pass  = 'admin';


	public function __construct () {
		Asset::add('css',       'css/style.css');
		Asset::add('lib',       'js/lib.js');
		Asset::add('js',        'js/app.js', 'lib');
		parent::__construct();
	}

	public function action_index () {
		if (Session::has('isAdmin')) return View::make('admin/index', array('users' => User::get() ));
		return Redirect::to('adminlogin');
	}

	public function action_loginForm () { return View::make('admin/login'); }
	public function action_loginCheck () {
		$creds = Input::get();
		if ($creds['username'] === static::$login && $creds['password'] === static::$pass) {
			Session::put('isAdmin', true);
			return Redirect::to('admin');
		}
		return Redirect::to('adminlogin');
	}

	public function action_logout () {
		Session::flush();
		return Redirect::to('adminlogin');
	}





	public function action_user ($id) {
		if (!Session::has('isAdmin')) return Redirect::to('adminlogin');
		if (isset($id)) {
			if ($id != 0) $user = User::get($id);
			else {
				$user = new User;
				$user->id = 0;
			}
			return View::make('admin/user', array('user' => $user ));
		}
	}

	public function action_user_save ($id) {
		if (!Session::has('isAdmin')) return Redirect::to('adminlogin');

		if (empty($id)) {
			$res = User::add(Input::get());
			if ($res === true) return Redirect::to('admin')->with('success', 'User created');
			return Redirect::to('admin/user/'.$id)->with_errors($res->errors->messages);
		}
		else {
			$res = User::update($id, Input::get());
			if ($res === true) return Redirect::to('admin')->with('success', 'User details updated');
			return Redirect::to('admin')->with_errors($res->errors->messages);
		}
	}

	public function action_user_delete ($id) {
		if (!Session::has('isAdmin')) return Redirect::to('adminlogin');
		if (!$id) return Redirect::to('admin')->with('error', 'User ID not set');

		$res = User::del($id);
		if ($res === true) return Redirect::to('admin')->with('success', 'User deleted');
		return Redirect::to('admin')->with('error', $res);
	}


}
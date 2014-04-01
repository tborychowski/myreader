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

	public function action_user ($id) {
		if (Session::has('isAdmin') && isset($id)) {
			return View::make('admin/user', array('user' => User::get($id) ));
		}
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


// 	$u = User::create([ 'email' => '', 'password' => Hash::make('') ]);
// 	$u->save();


}
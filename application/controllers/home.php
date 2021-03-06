<?php

class Home_Controller extends Base_Controller {

	public function __construct () {
		Asset::add('font',      'css/font-awesome.min.css');
		Asset::add('css',       'css/style.css');
		Asset::add('lib',       'js/lib.js');
		Asset::add('js',        'js/app.js', 'lib');
		parent::__construct();
	}

	public function action_index () {
		$tree = Source::get_tree('unread');
		$stats = Item::stats(Auth::user()->id);
		return View::make('home/index', [ 'tree' => $tree, 'stats' => $stats ]);
	}
	public function action_login () { return View::make('home/login'); }
	public function action_settings () { return View::make('home/settings'); }

	public function action_admin_login () { return View::make('home/admin_login'); }
	public function action_admin () { return View::make('home/admin'); }
}
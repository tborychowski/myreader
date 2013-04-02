<?php

$f3 = require(__DIR__.'/libs/f3/base.php');

$f3->set('DEBUG',0);
$f3->set('version','3.0');
$f3->set('AUTOLOAD',__dir__.'/;libs/f3/;libs/;libs/WideImage/;daos/;libs/twitteroauth/;libs/FeedWriter/');
$f3->set('cache',__dir__.'/data/cache');
$f3->set('BASEDIR',__dir__);

// read defaults
$f3->config('defaults.ini');

// read config, if it exists
if(file_exists('config.ini'))
    $f3->config('config.ini');


// init logger
$f3->set(
    'logger', 
    new \helpers\Logger( __dir__.'/data/logs/default.log', $f3->get('logger_level') )
);

// init authentication
$f3->set('auth', new \helpers\Authentication());


// define routes

// all users
$f3->route('GET /',           'controllers\Index->home');
$f3->route('POST /',          'controllers\Index->home');
$f3->route('GET /password',   'controllers\Index->password');
$f3->route('POST /password',  'controllers\Index->password');
$f3->route('GET /update',     'controllers\Items->update');
$f3->route('GET /api/login',  'controllers\Api->login');
$f3->route('GET /api/logout', 'controllers\Api->logout');

$f3->route('GET /notifier',   'controllers\Items->notifier');								// OK

// only for loggedin users or on public mode
if($f3->get('auth')->isLoggedin()===true || \F3::get('public')==1) {
	$f3->route('GET /rss',       'controllers\Rss->rss');
	$f3->route('GET /feed',      'controllers\Rss->rss');
	$f3->route('GET /tags',      'controllers\Tags->tags');									// OK

	$f3->route('GET /stats',   'controllers\Items->stats');									// OK
}

// only loggedin users
if($f3->get('auth')->isLoggedin()===true) {
	$f3->route('POST /mark',              'controllers\Items->mark');
	$f3->route('POST /mark/@item',        'controllers\Items->mark');
	$f3->route('POST /unmark/@item',      'controllers\Items->unmark');

	$f3->route('POST /starr/@item',       'controllers\Items->starr');
	$f3->route('POST /unstarr/@item',     'controllers\Items->unstarr');

	$f3->route('GET /items',              'controllers\Items->items');						// OK
	$f3->route('POST /api/items',         'controllers\Items->items');

	$f3->route('GET /sources',            'controllers\Sources->get');						// OK
	$f3->route('GET /source/params',      'controllers\Sources->params');
	$f3->route('GET /source',             'controllers\Sources->add');
	$f3->route('POST /source/@id',        'controllers\Sources->write');
	$f3->route('POST /source',            'controllers\Sources->write');
	$f3->route('DELETE /source/@id',      'controllers\Sources->remove');

	$f3->route('POST /tagset',            'controllers\Tags->tagset');

	$f3->route('GET /opml',               'controllers\Opml->show');
	$f3->route('POST /opml',              'controllers\Opml->add');
}

// dispatch
$f3->run();

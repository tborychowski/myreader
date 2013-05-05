<?php

// landing page
Route::get('/',         [ 'as' => 'home',     'uses' => 'home@index'    ]);
Route::get('/settings', [ 'as' => 'settings', 'uses' => 'home@settings' ]);
Route::get('/update',   [ 'as' => 'update',   'uses' => 'source@update' ]);
Route::get('/login',    [ 'as' => 'login',    'uses' => 'home@login'    ]);


/*** API ***/
Route::get('json/stats', 'item@stats');						// stats
Route::any('json/items/(:num?)/(:any?)', 'item@index');		// get item(s), read/star
Route::get('json/unreads', 'source@unreads');				// get unread sources with counter
Route::any('json/sources/(:num?)', 'source@index');			// manage sources




Route::get('/logout',   [ 'as' => 'logout', function () { Auth::logout(); return Redirect::to('login'); }]);





Event::listen('404', function () {
	if (Request::ajax()) return JSON::error('Service not found');
	return Response::error('404');
});

Event::listen('500', function ($exception) {
	if (Request::ajax()) return JSON::error('Server error');
	return Response::error('500');
});


Route::filter('before', function () {
	// Do stuff before every request to your application...
});


// Converts models, array of models or a regular array to a JSON response
Route::filter('after', function ($response) {
	$isArray = is_array($response->content);
	$isModelArray = ($isArray ? reset($response->content) instanceof Eloquent : false);
	if ($isArray or $response->content instanceof Eloquent) {
		$response->header('Content-Type', 'application/json');
		if ($isArray && !$isModelArray) $response->content = json_encode($response->content, JSON_NUMERIC_CHECK);				// simple array
		else $response->content = eloquent_to_json($response->content);															// model or array of model
	}
});


Route::filter('auth', function () { if (Auth::guest()) return Redirect::to('login'); });

Route::filter('csrf', function () { if (Request::forged()) return Response::error('500'); });
<?php

Route::group(['before' => 'auth'], function () {
	Route::get('/',         'home@index');					// landing page
	Route::get('/settings', 'home@settings');				// settings page

	Route::get('/json/stats',           'item@stats');
	Route::any('/json/items/(:num?)',   'item@index');		// all - all items or item
	Route::get('/json/sourcetree',      'source@tree');		// get unread source tree with counter
	Route::any('/json/sources/(:num?)', 'source@index');	// manage sources
	Route::get('/json/update',          'source@update');	// update route for a logged user (alias)

	Route::get('/logout', function () { Auth::logout(); return Redirect::to('login'); });
});


// both have to either pass email or be authenticated
Route::get('/update/(:any?)', 'source@update');
Route::get('/stats/(:any?)', 'item@stats');


Route::get('/login', [ 'as' => 'login', 'uses' => 'home@login' ]);
Route::post('/json/login', function () {
	if (Auth::attempt(Input::json(true))) return JSON::success();
	return JSON::error('Incorrect login or password');
});


// Route::get('/makeuser', function () {
// 	$u = User::create([ 'email' => '', 'password' => Hash::make('') ]);
// 	$u->save();
// });






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
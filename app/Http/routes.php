<?php

Route::get('/', 'HomeController@index');

Route::resource('source', 'SourceController');
Route::resource('article', 'ArticleController');

Route::get('import', 'ImportController@index');
Route::post('import', 'ImportController@parse');
Route::get('import-confirm', 'ImportController@confirm');




// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

Route::get('auth/register', 'Auth\AuthController@getRegister');
Route::post('auth/register', 'Auth\AuthController@postRegister');

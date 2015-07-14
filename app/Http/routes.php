<?php

Route::get('/', 'HomeController@index');
Route::get('/settings', 'SettingsController@index');


Route::resource('api/source', 'SourceController');
Route::resource('api/article', 'ArticleController');



// Authentication routes...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

Route::get('auth/register', 'Auth\AuthController@getRegister');
Route::post('auth/register', 'Auth\AuthController@postRegister');

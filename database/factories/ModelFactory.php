<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->email,
        'password' => str_random(10),
        'remember_token' => str_random(10),
    ];
});


$factory->define(App\Source::class, function (Faker\Generator $faker) {
    return [
        'name' => str_random(10),
        'url' => $faker->url,
        'folder' => 'Coding',
        'user_id' => 1
    ];
});


$factory->define(App\Article::class, function (Faker\Generator $faker) {
    return [
        'user_id' => 1,
        'source_id' => 1,
        'title' => str_random(10),
        'url' => $faker->url,
        'content' => $faker->realText(),
        'is_unread' => 1,
        'is_starred' => 0,
        'published_at' => $faker->dateTime(),
    ];
});

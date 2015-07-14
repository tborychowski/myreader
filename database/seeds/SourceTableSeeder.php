<?php

use Illuminate\Database\Seeder;

class SourceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // why you no work?
        // factory('App\User', 1)->create()->each(function($user) {
            // $user->sources()->save(factory('App\Source')->make());
        // });


        factory('App\Source', 10)->create();
    }
}

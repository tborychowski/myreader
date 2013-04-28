<?php

class Create_Feeds_Table {

	/**
	 * Make changes to the database.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sources', function ($table) {
			$table->engine = "MyISAM";
			$table->increments('id');
			$table->integer('user_id');
			$table->string('name');
			$table->string('tag', 25);
			$table->string('url')->unique();
			$table->string('icon');
			$table->timestamps();
		});
	}

	/**
	 * Revert the changes to the database.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('sources');
	}

}
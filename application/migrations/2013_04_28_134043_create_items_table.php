<?php

class Create_Items_Table {

	/**
	 * Make changes to the database.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('items', function ($table) {
			$table->engine = "MyISAM";
			$table->increments('id');
			$table->integer('user_id');
			$table->integer('source_id');
			$table->integer('item_id')->unique();	// simplepie ID
			$table->date('datetime');
			$table->string('title');
			$table->text('content');
			$table->string('url');
			$table->boolean('is_unread')->default(1);
			$table->boolean('is_starred')->default(0);
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
		Schema::drop('items');
	}

}
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
			$table->date('datetime');
			$table->string('title');
			$table->text('content');
			$table->string('url');
			$table->boolean('is_unread');
			$table->boolean('is_starred');
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
<?php

return array(

	'profile' => true,
	'fetch' => PDO::FETCH_CLASS,
	'default' => 'mysql',

	'connections' => array(

		'mysql' => array(
			'driver'   => 'mysql',
			'host'     => '127.0.0.1',
			'database' => 'myreader',
			'username' => 'root',
			'password' => 'pass',
			'charset'  => 'utf8',
			'collation'=> 'utf8_unicode_ci',
			'prefix'   => '',
		),


	),

	'redis' => array(

		'default' => array(
			'host'     => '127.0.0.1',
			'port'     => 6379,
			'database' => 0
		),

	),

);

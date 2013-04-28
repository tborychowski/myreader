<?php

class JSON {


	public static function error ($msg = '') {
		$res = array('result' => 'error');
		if ($msg != '') $res['details'] = $msg;

		return $res;
	}

	public static function success ($msg = '') {
		$res = array('result' => 'success');
		if ($msg != '') $res['details'] = $msg;

		return $res;
	}

}

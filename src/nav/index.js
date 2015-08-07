import $ from 'util';
import Hash from 'hash';

var isReady = false;




function _init () {

	if (!isReady) {

		Hash.init(function () {
			$.trigger('nav/changed', this);
		});


		if (Hash.section) $.trigger('nav/changed', Hash);
		else Hash.hash = 'unread';

	}

	isReady = true;
}


export default {
	init: function () { setTimeout(_init, 100); }
};

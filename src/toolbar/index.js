import $ from 'util';

var el, isReady = false;



function load () {

}

function init () {
	if (!isReady) {
		el = $('#toolbar');
	}

	load();
	isReady = true;
}


export default {
	init
};

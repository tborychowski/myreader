import $ from 'util';
// import Data from 'data/entries';

var el, isReady = false;



function load () {

}

function init () {
	if (!isReady) {
		el = $('#sidebar');
	}

	load();
	isReady = true;
}


export default {
	init
};

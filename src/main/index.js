import $ from 'util';
import Data from 'data/articles';

var el, isReady = false;



function load () {
	Data.getUnread().then(data => {
		console.log(data);
	});

}

function init () {
	if (!isReady) {
		el = $('#main');
	}

	load();
	isReady = true;
}


export default {
	init
};

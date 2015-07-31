import $ from 'util';
import Data from 'data/articles';
import card from 'card';

var main, el, filler, isReady = false;


function updateHeight () {
	if (!main ||  !main.length) return;
	var mainH = main[0].getBoundingClientRect().height;
	filler[0].style.height = mainH + 'px';
}


function load () {
	Data.getUnread().then(data => {
		el.html(card(data));
		$.trigger('data/changed', data);
	});
}


function init () {
	if (!isReady) {
		main = $('.home .main');
		if (!main) return;

		el = main.find('.articles');
		filler = main.find('.article-fill');

		$.on('resizeend', updateHeight);
	}

	updateHeight();
	load();
	isReady = true;
}


export default {
	init
};

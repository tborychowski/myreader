import $ from 'util';
import Data from 'data/articles';

var main, el, filler, isReady = false;


function updateHeight () {
	var mainH = main[0].getBoundingClientRect().height;
	filler[0].style.height = mainH + 'px';
}


function getArticleHtml (row) {
	return `<div class="card">
			<h2 class="card-title">${row.title}</h2>
			<div class="card-body">${row.content}</div>
			<div class="card-footer"></div>
		</div>`;
}


function load () {
	Data.getUnread().then(data => {
		el.html(data.map(getArticleHtml).join(''));
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

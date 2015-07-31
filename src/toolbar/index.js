import $ from 'util';

var el, isReady = false;



function eventHandler (e) {
	let el = $(e.target);
	let btn = el.closest('.btn');
	if (!btn || !btn.length) return;

	let action = btn.data('action');

	if (btn && action) {
		e.preventDefault();
		buttonAction(action, btn);
	}
}


function nextArticle () {
	console.log('next');
}

function prevArticle () {
	console.log('prev');
}



function buttonAction (action) {
	if (action === 'reload') return $.trigger('main/reload');
	if (action === 'prev') return prevArticle();
	if (action === 'next') return nextArticle();
}


function init () {
	if (!isReady) {
		el = $('.toolbar');
		el.on('click', eventHandler);
	}

	isReady = true;
}


export default {
	init
};

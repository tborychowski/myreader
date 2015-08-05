import $ from 'util';

var el, loadingBtn, isReady = false;


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


function buttonAction (action) {
	if (action === 'reload') return $.trigger('data/reload');
	if (action === 'prev') return $.trigger('nav/prev');
	if (action === 'next') return $.trigger('nav/next');
}


function handleLoading (loaded) {
	loadingBtn.toggleClass('spin', !loaded);
}


function init () {
	if (!isReady) {
		el = $('.toolbar');
		loadingBtn = el.find('.btn-loading');

		el.on('click', eventHandler);
		$.on('data/reload', handleLoading);
		$.on('data/changed', handleLoading);
	}

	isReady = true;
}


export default {
	init
};

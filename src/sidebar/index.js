import $ from 'util';

var el, tree, unreadEl, starredEl,
	isReady = false;


function updateBadge (el, c) {
	if (!el || !el.length) return;
	el[0].style.display = c ? 'block' : 'none';
	el.html(c);
}

function updateTree (sums) {
	tree.find('.visible').removeClass('visible');
	tree.find('.source-badge').html(0);

	for (let sid in sums) {
		let src = tree.find('.source-' + sid);
		let badge = src.find('.source-badge');
		updateBadge(badge, sums[sid]);
		src.addClass('visible');
		let srcList = src.closest('.source-list');
		if (srcList) srcList.prev('.source-folder').addClass('visible');
	}
}

function calc (data) {
	let sums = {}, unread = 0, starred = 0;

	for (let art of data) {
		let sid = art.source_id;
		sums[sid] = sums[sid] ? sums[sid] + 1 : 1;
		unread += +art.is_unread;
		starred += +art.is_starred;
	}

	updateBadge(unreadEl, unread);
	updateBadge(starredEl, starred);
	updateTree(sums);
}


function init () {
	if (!isReady) {
		el = $('.home .sidebar');
		tree = el.find('.source-tree');
		unreadEl = el.find('.label-unread .source-badge');
		starredEl = el.find('.label-starred .source-badge');

		$.on('data/changed', calc);
	}
	if (!el) return;

	isReady = true;
}


export default {
	init
};

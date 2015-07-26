import $ from 'util';

var el, tree, isReady = false;



function updateTree (data) {
	var sums = {};
	for (let art of data) {
		let sid = art.source_id;
		sums[sid] = sums[sid] ? sums[sid] + 1 : 1;
	}

	tree.find('.visible').removeClass('visible');

	for (let sid in sums) {
		let src = tree.find('.source-' + sid);
		let badge = src.find('.source-badge');
		badge.html(sums[sid]);
		src.addClass('visible');
		src.closest('.source-list').prev('.source-folder').addClass('visible');
	}
}

function init () {
	if (!isReady) {
		el = $('.home .sidebar');
		tree = el.find('.source-tree');

		$.on('data/changed', updateTree);
	}
	if (!el) return;

	isReady = true;
}


export default {
	init
};

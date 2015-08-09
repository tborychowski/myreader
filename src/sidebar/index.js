import $ from 'util';
import Hash from 'hash';

var el, tree, unreadEl, starredEl,
	isReady = false;



/*** HELPERS **************************************************************************************/
function updateBadge (el, c) {
	if (!el || !el.length) return;
	el[0].style.display = c ? 'block' : 'none';
	el.html(c);
}

function updateTree (sums) {
	tree.find('.visible').removeClass('visible');
	tree.find('.badge').html(0);

	for (let sid in sums) {
		let src = tree.find('.feed-' + sid);
		let badge = src.find('.badge');
		updateBadge(badge, sums[sid]);
		src.addClass('visible');
		let srcList = src.closest('.source-list');
		if (srcList) srcList.prev('.source-folder').addClass('visible');
	}
}

/**
 * Calculate and update sums for badges
 */
function calcSums (data) {
	let sums = {};

	for (let art of data.items) {
		let sid = art.source_id;
		sums[sid] = sums[sid] ? sums[sid] + 1 : 1;
	}

	updateBadge(unreadEl, data.unread);
	updateBadge(starredEl, data.starred);
	updateTree(sums);
}


function clickHandler (e) {
	var target = $(e.target), link = target.closest('.sidebar-link');
	if (link && link.length) {
		linkHandler(link);
		e.preventDefault();
	}
}

function linkHandler (link) {
	var data = link.data(),
		oldHash = Hash.hash,
		wrapper = data.section ? el : link.closest('.source-tree');

	wrapper.find('.sidebar-link.active').removeClass('active');
	Hash.hash = data;
	if (Hash.hash === oldHash) selectRows(Hash);
}

function selectRows (hash) {
	el.find('.label-' + hash.section + ' .sidebar-link').addClass('active');

	if (hash.folder) {
		el.find('.folder-' + hash.folder + ' .sidebar-link').addClass('active');
	}
	if (hash.id) {
		el.find('.feed-' + hash.id + ' .sidebar-link').addClass('active');
	}

}
/*** HELPERS **************************************************************************************/






function init () {
	if (!isReady) {
		el = $('.home .sidebar');
		tree = el.find('.source-tree');
		unreadEl = el.find('.label-unread .badge');
		starredEl = el.find('.label-starred .badge');

		el.on('click', clickHandler);
		$.on('data/changed', calcSums);
		$.on('nav/changed', selectRows);
	}
	if (!el) return;

	isReady = true;
}


export default {
	init
};

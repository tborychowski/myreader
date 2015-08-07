import $ from 'util';
import Hash from 'hash';

var el, tree, unreadEl, starredEl,
	isReady = false;



/*** HELPERS **************************************************************************************/

function clickHandler (e) {
	var target = $(e.target), link = target.closest('.sidebar-link');
	if (link && link.length) {
		linkHandler(link);
		e.preventDefault();
	}
}

function linkHandler (link) {
	var _hash = link[0].hash.substr(1),
		data = link.data(),
		big = { starred: 1, archive: 1, unread: 1 },
		wrapper = el;

	console.log('navigate to: ', data);

	if (!(_hash in big)) wrapper = link.closest('.source-tree');

	wrapper.find('.sidebar-link.active').removeClass('active');
	Hash.hash = link[0].hash;
}

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

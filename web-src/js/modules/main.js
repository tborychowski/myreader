(function ($, App) {
	'use strict';

	var _container = null,
		_isReady = false,
		_items = [],



	/*** HANDLERS ***************************************************************************************************************/
	_onKeyDown = function () {
		//TODO: key down handler
	},

	_entryClickHandler = function () {
		var entry = $(this), id = entry.data('id'), item = _getById(id);
		// if (entry.hasClass('active')) App.Publish('entry/next');
		// else {
			// item.unread = true;
			// _toggleUnread(item, entry);
		// }
		if (entry.hasClass('active')) {
			item.unread = true;
			_toggleUnread(item, entry);
		}
		else App.Publish('entry/next');
	},

	_btnClickHandler = function (e) {
		var btn = $(this),
			action = btn.data('action'),
			entry = btn.closest('.entry'),
			id = entry.data('id'),
			item = _getById(id);

		if (action === 'toggle-star') _toggleStar(item, entry);
		if (action === 'toggle-unread') _toggleUnread(item, entry);
		else {
			item.unread = true;
			_toggleUnread(item, entry);
		}

		e.stopPropagation();
	},

	_toggleStar = function (item, el) {
		item.starred = !item.starred;
		el.toggleClass('starred', item.starred);
		App.Post((item.starred ? '' : 'un') + 'starr/' + item.id, function () {
			App.Publish('entry/changed');
		});
	},

	_toggleUnread = function (item, el) {
		item.unread = !item.unread;
		el.toggleClass('unread', item.unread);
		App.Post((item.unread ? 'un' : '') + 'mark/' + item.id, function () {
			App.Publish('entry/changed');
		});
	},

	_previousItem = function () {
		var entry = _container.find('.entry.active'), prev;
		if (!entry || !entry.length) return;
		prev = entry.prev('.entry').addClass('active');
		if (prev.length) {
			entry.removeClass('active');
			_scrollEntryToView(prev);
		}
	},

	_nextItem = function () {
		var entry = _container.find('.entry.active'), next, item;
		if (!entry || !entry.length) return;
		next = entry.next('.entry').addClass('active');
		if (next.length) {
			entry.removeClass('active');
			_scrollEntryToView(next, function () {
				item = _getById(entry.data('id'));
				item.unread = true;
				_toggleUnread(item, entry);
			});
		}
	},

	_scrollEntryToView = function (entry, cb) {
		var dist, animSpeed = 'fast';
		if (!entry) {
			animSpeed = 0;
			entry = entry || _container.find('.entry').first();
		}
		dist = entry[0].offsetTop;
		_container.animate({ scrollTop: dist }, animSpeed, cb || function () {});
	},

	_getById = function (id) {
		var i = 0, item;
		for (; item = _items[i++] ;) if (item.id === id) return item;
		return null;
	},
	/*** HANDLERS ***************************************************************************************************************/

	_getItemHtml = function (item) {
		var cls = [ 'entry' ];
		if (item.unread === 1) cls.push('unread');
		if (item.starred === 1) cls.push('starred');

		return '<div id="entry' + item.id + '" class="' + cls.join(' ') + '" data-id="' + item.id + '">' +
		'<div class="entry-header">' +
			'<h3><a href="' + item.link + '" target="_blank">' + item.title + '</a></h3>' +
			'<span class="entry-time">' + item.date + '</span>' +
			'<span class="entry-source">from ' +
				'<a href="#" class="entry-source entry-source' + item.source + '">' + item.sourcetitle + '</a>' +
			'</span>' +
		'</div>' +
		'<div class="entry-body">' + item.content + '</div>' +
		'<div class="entry-footer">' +
			'<div class="pull-right">' +
				'<span class="tb-btn" data-action="readability"><i class="icon-bookmark"></i>readability</span>' +
				'<span class="tb-btn" data-action="email"><i class="icon-envelope"></i>email</span>' +
			'</div>' +
			'<span class="tb-btn addstar" data-action="toggle-star"><i class="icon-star-empty"></i></span>' +
			'<span class="tb-btn unstar" data-action="toggle-star"><i class="icon-star"></i></span>' +
			'<span class="tb-btn mark-unread" data-action="toggle-unread"><i class="icon-ok-sign"></i>mark as unread</span>' +
			'<span class="tb-btn mark-read" data-action="toggle-unread"><i class="icon-ok-circle"></i>mark as read</span>' +
		'</div>' +
		'</div>';
	},

	_getNoItemsHtml = function () { return '<div class="no-items"><i class="icon-rss"></i></div>'; },

	_populate = function (items) {
		if (!items || !items.length) return _container.html(_getNoItemsHtml());
		_items = items;
		var i = 0, item, itemAr = [];
		for (; item = items[i++] ;) itemAr.push(_getItemHtml(item));
		_container.html(itemAr);
		_container.find('.entry').first().addClass('active');
		_scrollEntryToView();
	},


	_load = function (cfg) {
		cfg = $.extend({ type: 'unread', items: 10 }, cfg);
		cfg = $.param(cfg);
		App.Get('items?' + cfg, _populate);

		//http://herhor.info/rss/?itemsPerPage=3&type=unread&tag=filmy&source=&ajax=true
	},



	_init = function () {
		if (_isReady) return;
		_container = $('#content');
		if (!_container.length) return;

		_container.on('click', '.entry', _entryClickHandler);
		_container.on('click', '.tb-btn', _btnClickHandler);
		$(document).on('keydown', _onKeyDown);

		//_load();

		_isReady = true;
	};

	App.Subscribe('entry/next', _nextItem);
	App.Subscribe('entry/prev', _previousItem);

	App.Subscribe('nav/changed', _load);
	App.Subscribe('app/ready', _init);
	App.Subscribe('app/refresh', _load);

}(jQuery, window.App, this));
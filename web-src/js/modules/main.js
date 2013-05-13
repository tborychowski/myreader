(function ($, App) {
	'use strict';

	var _body = null,
		_container = null,
		_isReady = false,
		_items = [],
		_btnRefresh = null,		// loading swirl
		_maxBodyHeight = 200,
		_params = {},



	/*** HANDLERS *****************************************************************************************************/

	_btnClickHandler = function (e) {
		var btn = $(this),
			action = btn.data('action'),
			entry = btn.closest('.entry'),
			item = _getById(entry.data('id'));

		if (action === 'toggle-expand') _toggleExpand(item, entry);
		if (action === 'toggle-star') _toggleStar(item, entry);
		if (action === 'toggle-unread') _toggleUnread(item, entry);
		else {
			item.is_unread = true;
			_toggleUnread(item, entry);
		}
		e.stopPropagation();
	},

	_toggleStar = function (item, el) {
		if (!item && !el) {
			el = _container.find('.entry.active');
			if (!el.length) el = _container.find('.entry').first().addClass('active');
			if (el.length) item = _getById(el.data('id'));
		}
		if (!item || !el.length) return;
		item.is_starred = !item.is_starred;
		el.toggleClass('starred', item.is_starred);
		App.Put('items/' + item.id, { is_starred: item.is_starred }, function () {
			App.Publish('nav/refresh');
		});
	},

	_toggleUnread = function (item, el) {
		if (!item && !el) {
			el = _container.find('.entry.active');
			if (!el.length) el = _container.find('.entry').first().addClass('active');
			if (el.length) item = _getById(el.data('id'));
		}
		if (!item || !el.length) return;
		item.is_unread = !item.is_unread;
		el.toggleClass('unread', item.is_unread);

		App.Put('items/' + item.id, { is_unread: item.is_unread }, function () {
			App.Publish('nav/refresh');
		});
	},

	_markAllAsRead = function (cfg) {
		App.Put('items?' + $.param(cfg), { is_unread: false }, function () {
			App.Publish('nav/refresh', [ { status: cfg.status, src: null, tag: null } ]);
		});
	},

	_toggleExpand = function (item, el) {
		var body = el.find('.entry-body'), isExpanded = el.hasClass('expanded'), bodyH;
		if (isExpanded) {
			bodyH = body.height();
			if (bodyH > _maxBodyHeight) {
				body.animate({ height: _maxBodyHeight }, function () {
					body.css({ maxHeight: _maxBodyHeight, height: 'auto' });
					el.removeClass('expanded');
				});
				_scrollEntryToView(el);
			}
			else body.css({ maxHeight: _maxBodyHeight });
		}
		else {
			body.css('max-height', 'inherit');
			bodyH = body.height();
			if (bodyH > _maxBodyHeight) {
				body.height(_maxBodyHeight).animate({ height: bodyH }, function () {
					el.addClass('expanded');
				});
			}
		}
	},

	_previousItem = function () {
		var entry = _container.find('.entry.active'), prev;
		if (!entry || !entry.length) return;
		prev = entry.prev('.entry');
		if (prev.length) {
			entry.removeClass('active');
			_scrollEntryToView(prev.addClass('active'));
		}
	},

	_nextItem = function () {
		var entry = _container.find('.entry.active'), next, item;
		if (entry && entry.length) next = entry.next('.entry');				// active item present - scroll to next
		else next = _container.find('.entry').first();						// no active item - mark first active
		if (next.length) {
			_scrollEntryToView(next, function () {
				if (entry.length) entry.removeClass('active');
				next.addClass('active');
				item = _getById(next.data('id'));
				item.is_unread = true;
				_toggleUnread(item, next);
			});
		}
	},

	_entryClickHandler = function () {
		var entry = $(this);
		if (!entry.hasClass('active')) {
			entry.siblings().removeClass('active');
			entry.prev().addClass('active');
			App.Publish('nav/next');
		}
		else if (entry.hasClass('unread')) _toggleUnread();
	},

	_scrollEntryToView = function (entry, callback) {
		var dist, animSpeed = 'fast';
		if (!entry || !entry.length) {
			animSpeed = 0;
			entry = entry || _container.find('.entry').first();
		}
		dist = entry[0].offsetTop;
		_body.animate({ scrollTop: dist }, animSpeed);
		setTimeout(callback || function () {}, animSpeed);
	},

	_getById = function (id) {
		var i = 0, item;
		for (; item = _items[i++] ;) if (item.id === id) return item;
		return null;
	},
	/*** HANDLERS *****************************************************************************************************/

	_getItemHtml = function (item) {
		var cls = [ 'entry' ];
		if (item.is_unread === 1) cls.push('unread');
		if (item.is_starred === 1) cls.push('starred');

		return '<div id="entry' + item.id + '" class="' + cls.join(' ') + '" data-id="' + item.id + '">' +
		'<div class="entry-header">' +
			'<h3><a href="' + item.url + '" target="_blank">' + item.title + '</a></h3>' +
			'<span class="entry-time">' + item.datetime + '</span>' +
			'<span class="entry-source">from ' +
				'<a href="#' + _params.status + '/src/' + item.source.id + '" class="entry-source entry-source-' +
					item.source.id + '">' + item.source.name + '</a>' +
			'</span>' +
		'</div>' +
		'<div class="entry-body">' + item.content + '</div>' +
		'<div class="entry-footer">' +
			'<div class="pull-right">' +
				'<span class="tb-btn btn-expand expand" data-action="toggle-expand" title="Expand">' +
					'<i class="icon-double-angle-down"></i></span>' +
				'<span class="tb-btn btn-expand collapse" data-action="toggle-expand" title="Collapse">' +
					'<i class="icon-double-angle-up"></i></span>' +
			'</div>' +

			'<span class="tb-btn addstar" data-action="toggle-star" title="Star Item (s)">' +
				'<i class="icon-star-empty"></i></span>' +
			'<span class="tb-btn unstar" data-action="toggle-star" title="Unstar Item (s)">' +
				'<i class="icon-star"></i></span>' +
			'<span class="tb-btn mark-unread" data-action="toggle-unread" title="Mark as Unread (u)">' +
				'<i class="icon-ok-sign"></i>mark as unread</span>' +
			'<span class="tb-btn mark-read" data-action="toggle-unread" title="Mark as Read (u)">' +
				'<i class="icon-ok-circle"></i>mark as read</span>' +
		'</div>' +
		'</div>';
	},

	_populate = function (items) {
		if (!items || !items.length) {
			_btnRefresh.removeClass('icon-spin');
			return _container.html('');
		}
		_items = items;
		var i = 0, item, itemAr = [];
		for (; item = items[i++] ;) itemAr.push(_getItemHtml(item));
		_container.html(itemAr);
		_scrollEntryToView();
		_btnRefresh.removeClass('icon-spin');
		_maxBodyHeight = parseInt(_container.find('.entry .entry-body').first().css('max-height'), 10);
	},


	_load = function (cfg) {
		if (!_isReady || !cfg) return;
		_params = cfg;
		_btnRefresh.addClass('icon-spin');
		App.Get('items?' + $.param(cfg), _populate);
	},



	_init = function () {
		if (_isReady) return;
		_container = $('#main.unreaditems .main-wrapper');
		if (!_container.length) return;
		_body = $('html,body');
		_btnRefresh = $('#toolbar .icon-repeat');

		_container
			.on('click', '.entry', _entryClickHandler)
			.on('click', '.tb-btn', _btnClickHandler);

		_isReady = true;
	};

	App.Subscribe('entry/allread', _markAllAsRead);
	App.Subscribe('entry/toggleStar', _toggleStar);
	App.Subscribe('entry/toggleUnread', _toggleUnread);

	App.Subscribe('nav/next', _nextItem);
	App.Subscribe('nav/prev', _previousItem);

	App.Subscribe('nav/refresh', _load);
	App.Subscribe('app/ready', _init);

}(jQuery, window.App, this));
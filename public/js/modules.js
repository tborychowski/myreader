(function ($, App) {
	'use strict';

	var _body = null,
		_container = null,
		_isReady = false,
		_items = [],
		_btnRefresh = null,		// loading swirl
		_itemsPerPage = 20,
		_maxBodyHeight = 200,



	/*** HANDLERS ***************************************************************************************************************/
	_btnClickHandler = function (e) {
		var btn = $(this),
			action = btn.data('action'),
			entry = btn.closest('.entry'),
			item = _getById(entry.data('id'));

		if (action === 'toggle-star') _toggleStar(item, entry);
		if (action === 'toggle-expand') _toggleExpand(item, entry);
		if (action === 'toggle-unread') _toggleUnread(item, entry);
		else {
			item.unread = true;
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
		item.starred = !item.starred;
		el.toggleClass('starred', item.starred);
		App.Post((item.starred ? '' : 'un') + 'starr/' + item.id, function () { App.Publish('entry/changed'); });
	},

	_toggleUnread = function (item, el) {
		if (!item && !el) {
			el = _container.find('.entry.active');
			if (!el.length) el = _container.find('.entry').first().addClass('active');
			if (el.length) item = _getById(el.data('id'));
		}
		if (!item || !el.length) return;
		item.unread = !item.unread;
		el.toggleClass('unread', item.unread);
		App.Post((item.unread ? 'un' : '') + 'mark/' + item.id, function () { App.Publish('entry/changed'); });
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
				item.unread = true;
				_toggleUnread(item, next);
			});
		}
	},

	_entryClickHandler = function () {
		var entry = $(this);
		if (!entry.hasClass('active')) {
			entry.siblings().removeClass('active');
			entry.prev().addClass('active');
			App.Publish('entry/next');
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
		_body.animate({ scrollTop: dist }, animSpeed, callback || function () {});
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
			// 	'<span class="tb-btn" data-action="readability"><i class="icon-bookmark"></i>readability</span>' +
			// 	'<span class="tb-btn" data-action="email"><i class="icon-envelope"></i>email</span>' +

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

	_getNoItemsHtml = function () { return '<div class="no-items"><i class="icon-rss"></i></div>'; },

	_populate = function (items) {
		if (!items || !items.length) {
			_btnRefresh.removeClass('icon-spin');
			return _container.html(_getNoItemsHtml());
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
		_btnRefresh.addClass('icon-spin');
		cfg = $.extend({ type: 'unread', items: _itemsPerPage }, cfg);
		App.Get('items?' + $.param(cfg), _populate);
		//http://domain.com?itemsPerPage=3&type=unread&tag=filmy&source=&ajax=true
	},



	_init = function () {
		if (_isReady) return;
		_container = $('#content');
		if (!_container.length) return;
		_body = $('html,body');
		_btnRefresh = $('#toolbar .icon-repeat');
		_container.on('click', '.entry', _entryClickHandler);
		_container.on('click', '.tb-btn', _btnClickHandler);

		//_load();

		_isReady = true;
	};

	App.Subscribe('entry/next', _nextItem);
	App.Subscribe('entry/prev', _previousItem);
	App.Subscribe('entry/toggleUnread', _toggleUnread);
	App.Subscribe('entry/toggleStar', _toggleStar);

	App.Subscribe('nav/changed', _load);
	App.Subscribe('app/refresh', _load);
	App.Subscribe('app/ready', _init);

}(jQuery, window.App, this));
(function ($, App) {
	'use strict';

	var _container = null,
		_isReady = false,
		_statsContainer = null,
		_sourcesContainer = null,
		_params = { linkType: 'type', linkId: 'unread', tag: '', source: '', type: 'unread' },
		_showZeroSources = false,
		_sources = null,




	/*** NAVIGATION *************************************************************************************************************/
	_navigate = function () {
		var dat = $(this).data(), cfg = { linkType: dat.navType, linkId: dat.action };
		if (dat.navType === 'tag' || dat.navType === 'source') {
			if (dat.action === 'all-tags') dat.action = '';
			cfg.source = cfg.tag = '';
			_container.find('.nav-source,.nav-tag').removeClass('active');
		}
		if (dat.navType === 'type') cfg.type = dat.action;
		else cfg[dat.navType] = dat.action;					// e.g. cfg.source = 123
		_params = $.extend(_params, cfg);
		App.Publish('nav/changed', [ _params ]);
	},


	_onNavChange = function (cfg) {
		_params = $.extend(_params, cfg);
		_populateSources();
	},

	_toggleSelection = function (el) {
		if (!el) el = _container.find('.nav-' + _params.linkType).filter('.nav-' + _params.linkId);
		if (!el || !el.length) return;

		el.addClass('active').siblings().removeClass('active');

		if (_params.linkType === 'tag') {
			el.nextUntil('.nav-tag', '.nav-source').show();
			el.find('.no-badge').hide();
		}
		else if (_params.linkType === 'source') {
			el.show();
			el.prevUntil('.nav-tag', '.nav-source').show();
			el.nextUntil('.nav-tag', '.nav-source').show();
			el.prev('.nav-tag').find('.no-badge').hide();
		}
	},
	/*** NAVIGATION *************************************************************************************************************/



	/*** HTML *******************************************************************************************************************/
	_getSourceHtml = function (src) {
		var icon = (src.icon ? '<img src="favicons/' + src.icon + '"">' : '<i class="icon-rss"></i>');
		return '<li class="nav-source nav-btn nav-' + src.id + '" data-nav-type="source" data-action="' + src.id + '">' +
			'<a href="#" class="nav-row">' +
				(src.unread ? '<span class="no-badge">' + src.unread + '</span>' : '') +
				'<span class="nav-icon">' + icon + '</span>' +
				'<span class="nav-name">' + src.title + '</span>' +
			'</a>' +
		'</li>';
	},

	_getTagHtml = function (tag, unread) {
		return '<li class="nav-tag nav-btn nav-' + tag + '" data-nav-type="tag" data-action="' + tag + '">' +
			'<a href="#" class="nav-row">' +
				(unread ? '<span class="no-badge">' + unread + '</span>' : '') +
				'<span class="nav-name">' + tag + '</span>' +
			'</a>' +
		'</li>';
	},


	_populateSources = function (sources) {
		if (sources && sources.length) _sources = sources;
		if (!_sources || !_sources.length) return;

		var i = 0, src, tags = {}, tagCounts = {}, tag, srcAr = [];
		_showZeroSources = (_params.type !== 'unread');

		srcAr.push('<li class="nav-header"><i class="btn-settings icon-cog"></i>' +
			'<span class="nav-name nav-btn" data-nav-type="tag" data-action="all-tags">Sources</span></li>');

		for (; src = _sources[i++] ;) {
			tagCounts[src.tag] = tagCounts[src.tag] ? tagCounts[src.tag] + src.unread : src.unread;
			tags[src.tag] = tags[src.tag] || [];
			if (src.unread || _showZeroSources) tags[src.tag].push(_getSourceHtml(src));
		}
		for (tag in tags) {
			if (!tags.hasOwnProperty(tag)) continue;
			if (!tagCounts[tag] && ! _showZeroSources) continue;
			srcAr.push(_getTagHtml(tag, tagCounts[tag]));
			srcAr.push(tags[tag].join(''));
		}
		_sourcesContainer.html(srcAr);
		_toggleSelection();
	},

	_updateStats = function (stats) {
		_statsContainer.find('.stats-unread .badge').html(stats.unread ? stats.unread : '0');
		_statsContainer.find('.stats-starred .no-badge').html(stats.starred ? stats.starred : '');
		_statsContainer.find('.stats-all .no-badge').html(stats.all ? stats.all : '');
	},
	/*** HTML *******************************************************************************************************************/






	/*** LOAD DATA **************************************************************************************************************/
	_loadStats = function () { App.Get('stats', _updateStats); },

	_loadSources = function () { App.Get('sources', _populateSources); },

	_reload = function () {
		_loadStats();
		_loadSources();
	},
	/*** LOAD DATA **************************************************************************************************************/






	_init = function () {
		if (_isReady) return;
		_container = $('#sidebar');
		if (!_container.length) return;

		_statsContainer = _container.find('.sidebar-list-stats');
		_sourcesContainer = _container.find('.sidebar-list-sources');
		_container.on('click', '.nav-btn', _navigate);

		_reload();

		App.Publish('nav/changed', [ _params ]);
		_isReady = true;
	};


	App.Subscribe('app/ready', _init);
	App.Subscribe('app/refresh', _reload);
	App.Subscribe('nav/changed', _onNavChange);
	App.Subscribe('entry/changed', _reload);

}(jQuery, window.App, this));
(function ($, App) {
	'use strict';

	var _container = null,
		_isReady = false,



	/*** HANDLERS ***************************************************************************************************************/
	_onKeyDown = function (e) {
		var key = e.keyCode;

		if (key === 82) App.Publish('app/refresh');					// r - refresh
		else if (key === 83) App.Publish('entry/toggleStar');		// s - toggle unread
		else if (key === 85) App.Publish('entry/toggleUnread');		// u - toggle unread
		else if (key === 32) App.Publish('entry/next');				// space - next
		else if (key === 33) App.Publish('entry/prev');				// pgup - prev
		else if (key === 34) App.Publish('entry/next');				// pgdown - next
		else window.log(key);
	},


	_btnClickHandler = function () {
		var btn = $(this), action = btn.data('action');

		if (action === 'next') App.Publish('entry/next');
		if (action === 'prev') App.Publish('entry/prev');
		if (action === 'refresh') App.Publish('app/refresh');
	},
	/*** HANDLERS ***************************************************************************************************************/



	init = function () {
		if (_isReady) return;
		_container = $('#toolbar');
		if (!_container.length) return;

		_container.on('click', '.btn', _btnClickHandler);
		$(document).on('keydown', _onKeyDown);

		_isReady = true;
	};


	App.Subscribe('app/ready', init);

}(jQuery, window.App, this));
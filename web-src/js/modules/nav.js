(function ($, App, window) {
	'use strict';

	var _sidebar = null,
		_toolbar = null,
		_sourcesContainer = null,

		_isReady = false,
		_params = { status: 'unread' },
		_items = null,


	/*** EVENT LISTENERS **********************************************************************************************/
	_popStateHandler = function () {
		var params = window.location.hash.substr(1);
		if (params.length) {
			params = params.split('/');
			if (params[0]) _params.status = params[0];
			if (params[1] && params[2]) {
				if (params[1] === 'tag') _params.tag = params[2];
				if (params[1] === 'src') _params.src = params[2];
			}
		}
		App.Publish('nav/refresh', [ _params ]);
	},

	_onKeyDown = function (e) {
		var key = e.keyCode;
		if (key === 83) App.Publish('entry/toggleStar');			// s - toggle unread
		else if (key === 85) App.Publish('entry/toggleUnread');		// u - toggle unread
		else if (key === 82) App.Publish('nav/refresh');			// r - refresh
		else if (key === 32) App.Publish('nav/next');				// space - next
		else if (key === 33) App.Publish('nav/prev');				// pgup - prev
		else if (key === 34) App.Publish('nav/next');				// pgdown - next
	},

	_toolbarBtnHandler = function () {
		var btn = $(this), action = btn.data('action');

		if (action === 'next') App.Publish('nav/next');
		if (action === 'prev') App.Publish('nav/prev');
		if (action === 'refresh') App.Publish('nav/refresh');

		if (action === 'unread') _navigate({ status: 'unread' });
		if (action === 'starred') _navigate({ status: 'starred' });
		if (action === 'archive') _navigate({ status: 'archive' });

		if (action === 'add') App.Publish('source/add');
		if (action === 'settings') window.location.href = App.rootPath + '/settings';
		if (action === 'back') window.location.href = App.rootPath;
	},

	_sidebarClickHandler = function (e) {
		e.preventDefault();
		var btn = $(this), type = btn.data('navType'), id = btn.data('action');
		_params = { status: _params.status };
		if (type === 'tag') _params.tag = id;
		if (type === 'src') _params.src = id;
		_navigate();
	},
	/*** EVENT LISTENERS **********************************************************************************************/


	_navigate = function (cfg) {
		if (cfg) $.extend(_params, cfg);
		var hash = [_params.status];
		if (_params.tag) hash.push('tag', _params.tag);
		else if (_params.src) hash.push('src', _params.src);
		window.location.hash = hash.join('/');
	},

	_toggleSelection = function () {
		_sidebar.find('.nav-btn').removeClass('active');
		if (_params.tag) _sourcesContainer.find('.nav-' + _params.tag).addClass('active');
		else if (_params.src) _sourcesContainer.find('.nav-' + _params.src).addClass('active');
		else _sidebar.find('.nav-header').addClass('active');

		_toolbar
			.find('.status-buttons .btn-' + _params.status).addClass('active')
			.siblings('.btn').removeClass('active');
	},



	/*** HTML *********************************************************************************************************/
	_getSourceHtml = function (src) {
		var icon = (src.icon ? '<img src="../storage/favicons/' + src.id + '.png"">' : '<i class="icon-rss"></i>');
		return '<li class="nav-source nav-btn nav-' + src.id + '" data-nav-type="src" data-action="' + src.id + '">' +
			'<a href="#" class="nav-row">' +
				(src.unread ? '<span class="no-badge">' + src.unread + '</span>' : '') +
				'<span class="nav-icon">' + icon + '</span>' +
				'<span class="nav-name">' + src.name + '</span>' +
			'</a>' +
		'</li>';
	},

	_getTagHtml = function (tag) {
		return '<li class="nav-tag nav-btn nav-' + tag.name + '" data-nav-type="tag" data-action="' + tag.name + '">' +
			'<a href="#" class="nav-row"><span class="nav-name">' + tag.name + '</span></a></li>';
	},


	_populateSources = function (sources) {
		if (typeof sources !== 'undefined') _items = sources;

		var i = 0, j = 0, src, tag, srcAr = [];
		if (_items && _items.length) {
			for (; tag = _items[i++] ;) {
				tag.tag = tag.tag || 'all';
				srcAr.push(_getTagHtml(tag));
				if (tag.items) for (j = 0; src = tag.items[j++] ;) srcAr.push(_getSourceHtml(src));
			}
		}
		_sourcesContainer.html(srcAr.join(''));
		_toggleSelection();
	},

	_populateStats = function (stats) {
		_sidebar.find('.nav-header .badge').html(stats.unread);
		_toolbar.find('.btn-unread .badge').html(stats.unread);
		_toolbar.find('.btn-starred .badge').html(stats.starred);
		_toolbar.find('.btn-archive .badge').html(stats.all);
		document.title = 'MyReader' + (stats.unread > 0 ? ' (' + stats.unread + ')' : '');
	},
	/*** HTML *********************************************************************************************************/






	/*** LOAD DATA ****************************************************************************************************/
	_loadStats = function () { if (_sourcesContainer.length) App.Get('stats', _populateStats); },

	_reload = function (cfg) {
		$.extend(_params, cfg);
		if (_sourcesContainer.length) App.Get('sourcetree?' + $.param(_params), _populateSources);
		_loadStats();
	},
	/*** LOAD DATA ****************************************************************************************************/






	_init = function () {
		if (_isReady) return;
		_sidebar = $('#sidebar');
		_toolbar = $('#toolbar');

		if (_sidebar.length) _sourcesContainer = _sidebar.find('.sidebar-sources');

		// EVENTS
		window.onpopstate = _popStateHandler;
		$(document).on('keydown', _onKeyDown);
		_toolbar.on('click', '.btn', _toolbarBtnHandler);
		_sidebar.on('click', '.nav-btn', _sidebarClickHandler);

		if (window.location.hash === '#') window.location.hash = 'unread';
		_popStateHandler();

		_isReady = true;
	};


	App.Subscribe('app/ready', _init);
	App.Subscribe('nav/refresh', _reload);

}(jQuery, window.App, this));
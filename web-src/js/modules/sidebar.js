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
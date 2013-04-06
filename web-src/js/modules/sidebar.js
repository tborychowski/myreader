(function ($, App) {
	'use strict';

	var _container = null,
		_isReady = false,
		_statsContainer = null,
		_tagsContainer = null,
		_sourcesContainer = null,
		_params = { linkType: 'type', linkId: 'unread', tag: '', source: '', type: 'unread' },




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
		_container
			.find('.nav-' + cfg.linkType)
			.filter('.nav-' + cfg.linkId)
			.addClass('active').siblings().removeClass('active');
	},
	/*** NAVIGATION *************************************************************************************************************/



	/*** HTML *******************************************************************************************************************/
	_getSourceHtml = function (src) {
		var icon = (src.icon ? '<img src="favicons/' + src.icon + '"">' : '<i class="icon-rss"></i>');
		return '<li class="nav-source nav-btn nav-' + src.id + '" data-nav-type="source" data-action="' + src.id + '">' +
			'<a href="#" class="row-fluid">' +
				'<span class="span2">' + icon + '</span>' +
				'<span class="span7">' + src.title + '</span>' +
				'<span class="span3">' + (src.unread ? '<span class="badge">' + src.unread + '</span>' : '') + '</span>' +
			'</a>' +
		'</li>';
	},

	_getTagHtml = function (tag) {
		return '<li class="nav-tag nav-btn nav-' + tag.tag + '" data-nav-type="tag" data-action="' + tag.tag + '">' +
			'<a href="#" class="row-fluid">' +
				'<span class="span2"><div class="color" style="background-color:' + tag.color + '"></div></span>' +
				'<span class="span7">' + tag.tag + '</span>' +
				'<span class="span3">' + (tag.unread ? '<span class="badge">' + tag.unread + '</span>' : '') + '</span>' +
			'</a>' +
		'</li>';
	},

	_populateTags = function (tags) {
		var i = 0, tag,
			tagAr = [
				'<li class="nav-header">Tags</li>',
				'<li class="nav-tag nav-btn nav-all-tags" data-nav-type="tag" data-action="all-tags">' +
					'<a href="#">all tags</a></li>'
			];
		for (; tag = tags[i++] ;) tagAr.push(_getTagHtml(tag));
		_tagsContainer.html(tagAr);
	},

	_populateSources = function (sources) {
		var i = 0, src, srcAr = [ '<li class="nav-header">Sources</li>' ];
		for (; src = sources[i++] ;) srcAr.push(_getSourceHtml(src));
		_sourcesContainer.html(srcAr);
	},

	_updateStats = function (stats) {
		_statsContainer.find('.stats-unread').html(stats.unread ? '<span class="badge">' + stats.unread + '</span>' : '');
		_statsContainer.find('.stats-starred .no-badge').html(stats.starred ? stats.starred : '');
		_statsContainer.find('.stats-all .no-badge').html(stats.all ? stats.all : '');
	},
	/*** HTML *******************************************************************************************************************/






	/*** LOAD DATA **************************************************************************************************************/
	_loadStats = function () { App.Get('stats', _updateStats); },
	_loadTags = function () { App.Get('tags', _populateTags); },
	_loadSources = function () { App.Get('sources', _populateSources); },

	_reload = function () {
		_loadStats();
		_loadTags();
		_loadSources();
	},
	/*** LOAD DATA **************************************************************************************************************/






	_init = function () {
		if (_isReady) return;
		_container = $('#sidebar');
		if (!_container.length) return;

		_statsContainer = _container.find('.sidebar-list-stats');
		_tagsContainer = _container.find('.sidebar-list-tags');
		_sourcesContainer = _container.find('.sidebar-list-sources');


		_container.on('click', '.nav-btn', _navigate);

		_loadStats();
		_loadTags();
		_loadSources();

		App.Publish('nav/changed', [ _params ]);

		_isReady = true;
	};


	App.Subscribe('app/ready', _init);
	App.Subscribe('app/refresh', _reload);
	App.Subscribe('entry/changed', _reload);
	App.Subscribe('nav/changed', _onNavChange);

}(jQuery, window.App, this));
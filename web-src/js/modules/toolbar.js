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
		// else window.log(key);
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
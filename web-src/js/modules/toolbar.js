(function ($, App) {
	'use strict';

	var _container = null,
		_isReady = false,



	/*** HANDLERS ***************************************************************************************************************/
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

		_isReady = true;
	};


	App.Subscribe('app/ready', init);

}(jQuery, window.App, this));
window.App = (function ($, App, window) {
	'use strict';


	/**
	 * Toaster message short-cut
	 * @param msg		text message to show
	 * @param type		type of the message [success, info | error | warning,alert]; (defaults to: success)
	 */
	App.Msg = function (conf, type) { window.log(conf, type); };



	/**
	 * Global error handler
	 * @param msg	msg object: { result: 'error', type:'', details: 'message details' }
	 */
	App.Error = function (msg) {
		if (!msg) App.Msg('Unknown server error.', 'error');
		else if (typeof msg === 'string') App.Msg({type: 'error', text: msg});
		else {
			if (msg.status === 404 || msg.status === 400) App.Msg('Requested service not available', 'error');
			else {
				if (msg.details) App.Msg({ type: (msg.result === 'warning' ? 'warning' : 'error'), text: msg.details, delay: 5 });
				else App.Msg('Unknown server error.', 'error');
			}
		}
		return false;
	};


	/**
	 * Application Init
	 */
	$(function () {
		//$.ajaxSetup({ type: 'get', dataType: 'json', mimeType: 'application/json', contentType: 'application/json' });
		App.Publish('app/ready');
	});


	return App;

}(jQuery, window.App || {}, this));

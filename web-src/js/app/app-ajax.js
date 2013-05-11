window.App = (function ($, App) {
	'use strict';

	var rootPath = (App.rootPath || '') + '/json/',

	requestCompleted = function (data, callback) {
		// response can be {}, [] or null
		if (typeof data !== 'object') return App.Error('Server response error');
		if (data && data.result === 'error') return App.Error(data);
		if (data && data.result === 'warning') App.Error(data);
		// execute callback
		if (callback && typeof callback === 'function') callback.call(callback, data);
	};


	/**
	 * Ajax GET short-cut
	 * @param url			url to request => assist/{url}
	 * @param callback		callback function
	 * e.g. App.Request('url', function(response){ });
	 */
	App.Get = function (url, data, callback) {
		if (typeof data === 'function') { callback = data; data = {}; }
		return $.ajax({ url: rootPath + url, type: 'get', data: data })
			.fail(App.Error)
			.done(function (data) { requestCompleted(data, callback); });
	};

	/**
	 * Ajax POST short-cut
	 * @param url			url to request => assist/{url}
	 * @param data			data will be JSON.stringified
	 * @param callback		callback function
	 * e.g. App.Request('url', { id: 123 }, function(response){ });
	 */
	App.Post = function (url, data, callback) {
		if (typeof data === 'function' && !callback) {
			callback = data;
			data = {};
		}
		return $.ajax({ url: rootPath + url, type: 'post', data: JSON.stringify(data) })
			.fail(App.Error)
			.done(function (data) { requestCompleted(data, callback); });
	};

	/**
	 * Ajax PUT short-cut
	 * @param url			url to request => assist/{url}
	 * @param data			data will be JSON.stringified
	 * @param callback		callback function
	 * e.g. App.Request('url', { id: 123 }, function(response){ });
	 */
	App.Put = function (url, data, callback) {
		if (typeof data === 'function' && !callback) {
			callback = data;
			data = {};
		}
		return $.ajax({ url: rootPath + url, type: 'put', data: JSON.stringify(data) })
			.fail(App.Error)
			.done(function (data) { requestCompleted(data, callback); });
	};


	/**
	 * Ajax DELETE short-cut
	 * @param url			url to request => assist/{url}
	 * @param callback		callback function
	 * e.g. App.Request('url', function(response){ });
	 */
	App.Delete = function (url, callback) {
		return $.ajax({ url: rootPath + url, type: 'delete' })
			.fail(App.Error)
			.done(function (data) { requestCompleted(data, callback); });
	};



	return App;

}(jQuery, window.App || {}, this));

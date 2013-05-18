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
	 * @param data			(optional) data to pass to the server
	 * @param callback		callback function
	 * @param timeout		(optional) when longer timeout is required
	 * e.g. App.Request('url', function(response){ });
	 */
	App.Get = function (url, data, callback, timeout) {
		var params = { url: rootPath + url, type: 'get', data: data };
		if (typeof callback === 'number') timeout = callback;
		if (typeof data === 'function') { callback = data; data = {}; }
		if (timeout) params.timeout = timeout;
		return $.ajax(params).fail(App.Error).done(function (data) { requestCompleted(data, callback); });
	};

	/**
	 * Ajax POST short-cut
	 * @param url			url to request => assist/{url}
	 * @param data			data will be JSON.stringified
	 * @param callback		callback function
	 * e.g. App.Request('url', { id: 123 }, function(response){ });
	 */
	App.Post = function (url, data, callback) {
		var params = { url: rootPath + url, type: 'post', data: JSON.stringify(data) };
		if (typeof data === 'function') { callback = data; data = {}; }
		return $.ajax(params).fail(App.Error).done(function (data) { requestCompleted(data, callback); });
	};

	/**
	 * Ajax PUT short-cut
	 * @param url			url to request => assist/{url}
	 * @param data			data will be JSON.stringified
	 * @param callback		callback function
	 * e.g. App.Request('url', { id: 123 }, function(response){ });
	 */
	App.Put = function (url, data, callback) {
		var params = { url: rootPath + url, type: 'put', data: JSON.stringify(data) };
		if (typeof data === 'function') { callback = data; data = {}; }
		return $.ajax(params).fail(App.Error).done(function (data) { requestCompleted(data, callback); });
	};


	/**
	 * Ajax DELETE short-cut
	 * @param url			url to request => assist/{url}
	 * @param callback		callback function
	 * e.g. App.Request('url', function(response){ });
	 */
	App.Delete = function (url, callback) {
		var params = { url: rootPath + url, type: 'delete' };
		return $.ajax(params).fail(App.Error).done(function (data) { requestCompleted(data, callback); });
	};



	return App;

}(jQuery, window.App || {}, this));

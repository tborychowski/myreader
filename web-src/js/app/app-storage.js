window.App = (function (App, window) {
	'use strict';

	/**
	 * Manage storage (session or local)
	 */
	App.Storage = {
		/**
		 * Retrieve value from the browser storage
		 * @param name		- name of the parameter to get
		 * @param val		- value (objects will be serialized) assigned to the name
		 * @param storage	- type of the storage: [ session | local ], default: 'session'
		 */
		get : function (name, storage) {
			storage = (storage || 'session') + 'Storage';
			if (!window[storage]) return window.log('Browser does not support ' + storage + '!');
			var json = window[storage][name];
			if (json) return JSON.parse(json);
		},

		/**
		 * Save value to the browser storage
		 * @param name		- name of the parameter to save
		 * @param val		- value (objects will be serialized) to assign to the name
		 * @param storage	- type of the storage: [ session | local ], default: 'session'
		 */
		set : function (name, val, storage) {
			storage = (storage || 'session') + 'Storage';
			if (!window[storage]) return window.log('Browser does not support ' + storage + '!');
			window[storage][name] = JSON.stringify(val);
		},

		del : function (name, storage) {
			storage = (storage || 'session') + 'Storage';
			if (!window[storage]) return window.log('Browser does not support ' + storage + '!');
			if (window[storage][name]) delete window[storage][name];
		}
	};

	return App;
}(window.App || {}, this));

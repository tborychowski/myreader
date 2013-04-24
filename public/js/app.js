window.App = (function ($, App) {
	'use strict';

	var rootPath = (App.rootPath || '/'),

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

/**
 * JS OVERRIDES
 */
(function (window) {
	'use strict';
	//jshint camelcase: false

	String.prototype.trim = function (str) {return this.ltrim(str).rtrim(str); };
	String.prototype.ltrim = function (str) { return this.replace(new RegExp('^' + (str ? str : '\\s') + '+'), ''); };
	String.prototype.rtrim = function (str) { return this.replace(new RegExp((str ? str : '\\s') + '+$'), ''); };
	String.prototype.ucfirst = function () {
		return this.toLowerCase().replace(/\b([a-z])/gi, function (c) { return c.toUpperCase(); });
	};
	String.prototype.stripTags = function () {
		var reg = new RegExp('<\\/?\\w+(\\s*[^>])*>'), str = this;
		while (reg.test(this)) str = str.replace(reg, '');
		return str;
	};


	// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function  () {
			var hasOwnProp = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf',
					'propertyIsEnumerable', 'constructor'],
				dontEnumsLength = dontEnums.length;

			return function  (obj) {
				if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
					throw new TypeError('Object.keys called on non-object');
				}
				var result = [], i = 0, prop;
				for (prop in obj) if (hasOwnProp.call(obj, prop)) result.push(prop);
				if (hasDontEnumBug) {
					for (; i < dontEnumsLength; i++) {
						if (hasOwnProp.call(obj, dontEnums[i])) result.push(dontEnums[i]);
					}
				}
				return result;
			};
		})();
	}

	// firebug short-cuts
	window.log = (Function.bind && window.console && typeof window.console.log === 'function') ?
			window.console.log.bind(window.console) : function (e) { window.alert(JSON.stringify(e)); };

	window.dir = (Function.bind && window.console && typeof window.console.dir === 'function') ?
			window.console.dir.bind(window.console) : function (e) { window.alert(JSON.stringify(e)); };

}(this));
window.App = (function (App) {
	'use strict';

	var cache = {};


	/**
	 * Publish data for a topic
	 * @param topic {string}  name of the topic
	 * @param args {array}    array of arguments to pass to a callback function subscribed to this topic
	 *                        e.g. App.Publish('app/ready', [ pageName ]);
	 */
	App.Publish = function (topic, args) {
		if (!cache[topic]) return;
		for (var i = 0, el; el = cache[topic][i++] ;) el.fn.apply(el.scope, args || []);
	};


	/**
	 * Register a callback for a topic
	 * @param topic {string}      name of the topic
	 * @param callback {function}
	 * @param scope {object}      [optional] scope for callback
	 * @returns {array}           handle for unsubscribe fn
	 */
	App.Subscribe = function (topic, callback, scope) {
		if (!cache[topic]) cache[topic] = [];
		cache[topic].push({ fn: callback, scope: scope || callback });
		return [topic, callback, scope];
	};


	/**
	 * Unregister a function subscribed for a topic
	 * @param handle {array} a handle that was returned from the Subscribe function
	 */
	App.Unsubscribe = function (handle) {
		/*jshint eqeqeq:false*/
		var i = 0, el, topic = handle[0];
		if (!cache[topic]) return;
		for (; el = cache[topic][i]; i++) if (el.fn == handle[1]) cache[topic].splice(i, 1);
	};


	return App;
}(window.App || {}));

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

window.App = (function (App, window) {
	'use strict';
	/*jshint maxlen: 500, undef:false, onevar: false */

	App.UTIL = {

		isTouch : (/iPhone|iPod|iPad/ig).test(navigator.userAgent),

		/**
		 * Modified & lintified version of https://gist.github.com/527683
		 * @return {mixed}       if IE version number or false
		 */
		isIE : (function (i, p, undef) {
			var br = p.getElementsByTagName('br');
			do { p.innerHTML = '<!--[if gt IE ' + (++i) + ']><br><![endif]-->'; } while (br[0]);
			return i > 4 ? i : undef;
		}(3, document.createElement('p'), false)),


		/* better typeof */
		getType : function (obj) { return obj ? Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() : 'undefined'; },


		/**
		 *  Converts flat objects, e.g.: { a: 1, b:2, c:[1,2,3] }  to  "a=1&b=2&c=1,2,3"
		 */
		objToUrl : function (obj) {
			if (this.getType(obj) !== 'object') return '';
			var a = null, str = [];
			for (a in obj) { if (obj.hasOwnProperty(a)) str.push(window.escape(a) + '=' + window.escape(obj[a])); }
			return str.join('&');
		},

		/**
		 * Converts: "?a=1&b=2&c=3"  to  { a:'1', b:'2', c:'3' }
		 * @param url {string}			url string to convert
		 * @param convert {boolean}		true to convert vars to real types (e.g. '1' to 1, 'true' to true)
		 */
		urlToObj : function (url, convert) {
			if (!url || !url.length) return {};
			var params = {}, vars = url.replace(/^\?/, '').split('&'), pair = null, i = 0, vr = null, n = null, v = null;
			for (; vr = vars[i++] ;) {
				pair = vr.split('=');
				n = window.unescape(pair[0]);
				v = window.unescape(pair[1]);

				if (v.indexOf(',') > -1) v = v.split(',');																		// if commas in value - split to array
				if (convert) v = this.varToRealType(v);
				if (params[n] === undefined) params[n] = v;																		// if first entry with this name
				else if (typeof params[n] === 'string' || typeof params[n] === 'number') params[n] = [ params[n], v ];			// if second entry with this name
				else params[n].push(v);																							// if third or more with this name
			}
			return params;
		},

		/**
		 * Returns the parameter value from address bar
		 * @param param		parameter name
		 * @param url		url string can be given
		 * @param convert	true to convert vars to real types (e.g. '1' to 1)
		 * @returns			parameter value
		 */
		getParam : function (param, url, convert) {
			var obj = this.urlToObj(url || location.search, convert);
			if (obj[param] !== undefined) return obj[param];
			return false;
		},


		/**
		 * Check whether a string might be a number
		 * @param v {string}	a stringified number
		 * @returns	{boolean}	true or false
		 */
		isNumber : function (v) {
			if (typeof v === 'number') return true;
			if (typeof v !== 'string') return false;
			return (/^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/).test(v);
		},

		/**
		 * Convert string variable to its real type, e.g. '1' to 1
		 * @param v		string var
		 * @return		typed var
		 */
		varToRealType : function (v) {
			if (this.isNumber(v)) {
				var originalv = v;
				v = parseFloat('' + v);
				if (('' + v) !== originalv) v = originalv;
			}
			else if (v === 'true') v = true;
			else if (v === 'false') v = false;
			if (v === '') v = undefined;
			if (this.getType(v) === 'array') for (var i = 0, il = v.length; i < il; i++) v[i] = this.varToRealType(v[i]);
			return v;
		},


		/**
		 * Compares 2 objects
		 * @param x	object 1
		 * @param y	object 2
		 * @returns	true if they are identical, false if they are different
		 */
		areObjectsEqual : function (x, y) {
			if (x === y) return true;																							// if both x and y are null or undefined and exactly the same
			if (!(x instanceof Object) || !(y instanceof Object)) return false;													// if they are not strictly equal, they both need to be Objects
			if (x.constructor !== y.constructor) return false;																	// they must have the exact same prototype chain, the closest we can do is test there constructor.
			for (var p in x) {
				if (!x.hasOwnProperty(p)) continue;																				// other properties were tested using x.constructor === y.constructor
				if (!y.hasOwnProperty(p)) return false;																			// allows to compare x[ p ] and y[ p ] when set to undefined
				if (x[p] === y[p]) continue;																					// if they have the same strict value or identity then they are equal
				if (typeof(x[p]) !== 'object') return false;																	// Numbers, Strings, Functions, Booleans must be strictly equal
				if (!this.areObjectsEqual(x[p], y[p])) return false;															// Objects and Arrays must be tested recursively
			}
			for (p in y) if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;											// allows x[ p ] to be set to undefined
			return true;
		},

		/**
		 * Checks if object is empty (has no own properties)
		 * @param x	object
		 * @returns	true if object is empty, false if it has any own properties
		 */
		isObjectEmpty : function (x) {
			if (!x || typeof x !== 'object') return true;
			for (var a in x) if (x.hasOwnProperty(a)) return false;
			return true;
		},


		/**
		 * Clean empty or null properties from an object
		 * @param [required] 1			first parameter is an object to clean
		 * @param [optional] 2,3,...	names of additional properties to remove from the object
		 * @returns						clean object
		 */
		clearProperties : function () {
			if (arguments.length < 1) return {};
			var obj = arguments[0], newO = {}, name = '', val, props = [];
			if (arguments.length > 1) props = Array.prototype.slice.call(arguments, 1);
			for (name in obj) {
				if (!obj.hasOwnProperty(name)) continue;
				val = obj[name];
				if (val === undefined || val === null) continue;								// null or undefined
				if (this.getType(val) === 'array' && !val.length) continue;						// empty array
				if (this.getType(val) === 'object' && this.isObjectEmpty(val)) continue;		// empty object
				if (typeof val === 'string' && !val.length) continue;							// empty string
				if (this.inArray(props, name) > -1) continue;									// name is in disabled properties
				newO[name] = val;
			}
			return newO;
		},


		/**
		 * Formats numbers (or string numbers)
		 * @param number	int or int-parsable string
		 * @param prec		decimal precision
		 * @returns			formatted number as string
		 */
		numberFormat : function (number, prec) {
			var ext, name, numS, rgx = /(\d+)(\d{3})/;
			number = number || '0';
			prec = prec || 0;
			numS = ('' + number).split('.');
			name = numS[0];
			ext = numS[1];
			if (prec > 0) ext = ((ext || '') + new Array(prec + 1).join('0')).substr(0, prec);
			else ext = '';
			while (rgx.test(name)) name = name.replace(rgx, '$1' + ',' + '$2');
			return name + (ext ? '.' + ext : '');
		},


		/**
		 * Normalised rand function
		 */
		rand : function (max, min) { min = min || 0; return Math.floor(Math.random() * (max - min + 1) + min); },



		inArray : function (a, v) {
			if (this.getType(a) !== 'array') return false;
			var i = 0, e;
			if (typeof v === 'object') { for (i = 0; e = a[i++] ;) if (this.areObjectsEqual(e, v)) return i - 1; }
			else { for (i = 0; e = a[i++] ;) if (e === v) return i - 1; }
			return -1;
		},

		removeFromArray : function (a, v) {
			var nA = [], i = 0, el;
			if (typeof v === 'object') { for (; el = a[i++] ;) if (!this.areObjectsEqual(el, v)) nA.push(el); }
			else { for (; el = a[i++] ;) if (el !== v) nA.push(el); }
			return nA;
		},

		uniqueArray : function (a) {
			var b = [], l = a.length, i = 0, j;
			for (; i < l; i++) {
				for (j = i + 1; j < l; j++) {
					if (typeof a[i] === 'object' && this.areObjectsEqual(a[i], a[j])) j = ++i;
					else if (a[i] === a[j]) j = ++i;
				}
				b.push(a[i]);
			}
			return b;
		},

		stripTags : function (str) {
			var reg = new RegExp('<\\/?\\w+(\\s*[^>])*>');
			while (reg.test(str)) str = str.replace(reg, '');
			return str;
		},

		decodeEntities : function (str) {
			if (!str) return '';
			if (('' + str).indexOf('&') === -1) return str;
			var d = document.createElement('div');
			if (this.isIE) str = str.replace(/&apos;/g, '&#39');																// IE does not recognise &apos;
			d.innerHTML = str;
			return d.innerText || d.textContent;
		}
	};

	return App;
}(window.App || {}, this));

window.App = (function ($, App, window) {
	'use strict';


	/**
	 * Toaster message short-cut
	 * @param msg		text message to show
	 * @param type		type of the message [success, info | error | warning,alert]; (defaults to: success)
	 */
	App.Msg = function (conf, type) { window.Toaster(conf, type); };



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

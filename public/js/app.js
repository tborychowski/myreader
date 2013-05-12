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

/**
 * JS OVERRIDES
 */
(function () {
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
		while (reg.test(str)) str = str.replace(reg, '');
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
	// window.log = (Function.bind && window.console && typeof window.console.log === 'function') ?
	// 		window.console.log.bind(window.console) : function (e) { window.alert(JSON.stringify(e)); };

	// window.dir = (Function.bind && window.console && typeof window.console.dir === 'function') ?
	// 		window.console.dir.bind(window.console) : function (e) { window.alert(JSON.stringify(e)); };

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

		/**
		 * Remove item from array
		 * @param  {array} a   old array
		 * @param  {mixed} v   item to remove
		 * @return {array}     new array without the item
		 */
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
	App.Msg = function (conf, type) {
		console.log(conf, type);
		if (conf && conf.type === 'error') window.alert(conf.text);
	};



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

(function ($, App, window) {
	'use strict';

	var form = null, //chpassMenuItem = null,

	formSubmit = function () {
		App.Post('login', form.formParams(), function (resp) {
			if (resp.result === 'success') location.href = './';
		});
		return false;
	},

	// changeMyPassword = function () {
	// 	var user = chpassMenuItem.data(), currentPass = window.prompt('What is your current password?', ''), newPass;
	// 	if (currentPass === null) return;
	// 	App.Post('login', { username: user.login, password: currentPass, remember: true }, function (res) {
	// 		if (res.result !== 'success') return;
	// 		newPass = window.prompt('What is your new password?', '');
	// 		if (newPass === null) return;
	// 		App.Put('users/' + user.id, { password: newPass }, function (res) {
	// 			if (res.result === 'success') App.Msg('Your password has been updated');
	// 		});
	// 	});
	// },

	init = function () {
		if (window.document.body.parentNode.className === 'login') {
			form = $('form:first');
			if (!form.length) return;
			form.on('submit', formSubmit);
		}
		// else {
		// 	chpassMenuItem = $('#menubar #btnChangePassword');
		// 	if (!chpassMenuItem.length) return;
		// 	chpassMenuItem.on('click', changeMyPassword);
		// }
	};

	App.Subscribe('app/ready', init);

}(jQuery, window.App, this));
(function ($, App) {
	'use strict';

	var _body = null,
		_container = null,
		_isReady = false,
		_items = [],
		_btnRefresh = null,		// loading swirl
		_maxBodyHeight = 200,
		_params = {},



	/*** HANDLERS *****************************************************************************************************/

	_btnClickHandler = function (e) {
		var btn = $(this),
			action = btn.data('action'),
			entry = btn.closest('.entry'),
			item = _getById(entry.data('id'));

		if (action === 'toggle-expand') _toggleExpand(item, entry);
		if (action === 'toggle-star') _toggleStar(item, entry);
		if (action === 'toggle-unread') _toggleUnread(item, entry);
		else {
			item.is_unread = true;
			_toggleUnread(item, entry);
		}
		e.stopPropagation();
	},

	_toggleStar = function (item, el) {
		if (!item && !el) {
			el = _container.find('.entry.active');
			if (!el.length) el = _container.find('.entry').first().addClass('active');
			if (el.length) item = _getById(el.data('id'));
		}
		if (!item || !el.length) return;
		item.is_starred = !item.is_starred;
		el.toggleClass('starred', item.is_starred);
		App.Put('items/' + item.id, { is_starred: item.is_starred }, function () {
			App.Publish('nav/refresh');
		});
	},

	_toggleUnread = function (item, el) {
		if (!item && !el) {
			el = _container.find('.entry.active');
			if (!el.length) el = _container.find('.entry').first().addClass('active');
			if (el.length) item = _getById(el.data('id'));
		}
		if (!item || !el.length) return;
		item.is_unread = !item.is_unread;
		el.toggleClass('unread', item.is_unread);

		App.Put('items/' + item.id, { is_unread: item.is_unread }, function () {
			App.Publish('nav/refresh');
		});
	},

	_markAllAsRead = function (cfg) {
		App.Put('items?' + $.param(cfg), { is_unread: false }, function () {
			App.Publish('nav/refresh', [ { status: cfg.status, src: null, tag: null } ]);
		});
	},

	_toggleExpand = function (item, el) {
		var body = el.find('.entry-body'), isExpanded = el.hasClass('expanded'), bodyH;
		if (isExpanded) {
			bodyH = body.height();
			if (bodyH > _maxBodyHeight) {
				body.animate({ height: _maxBodyHeight }, function () {
					body.css({ maxHeight: _maxBodyHeight, height: 'auto' });
					el.removeClass('expanded');
				});
				_scrollEntryToView(el);
			}
			else body.css({ maxHeight: _maxBodyHeight });
		}
		else {
			body.css('max-height', 'inherit');
			bodyH = body.height();
			if (bodyH > _maxBodyHeight) {
				body.height(_maxBodyHeight).animate({ height: bodyH }, function () {
					el.addClass('expanded');
				});
			}
		}
	},

	_previousItem = function () {
		var entry = _container.find('.entry.active'), prev;
		if (!entry || !entry.length) return;
		prev = entry.prev('.entry');
		if (prev.length) {
			entry.removeClass('active');
			_scrollEntryToView(prev.addClass('active'));
		}
	},

	_nextItem = function () {
		var entry = _container.find('.entry.active'), next, item;
		if (entry && entry.length) next = entry.next('.entry');				// active item present - scroll to next
		else next = _container.find('.entry').first();						// no active item - mark first active
		if (next.length) {
			_scrollEntryToView(next, function () {
				if (entry.length) entry.removeClass('active');
				next.addClass('active');
				item = _getById(next.data('id'));
				item.is_unread = true;
				_toggleUnread(item, next);
			});
		}
	},

	_entryClickHandler = function () {
		var entry = $(this);
		if (!entry.hasClass('active')) {
			entry.siblings().removeClass('active');
			entry.prev().addClass('active');
			App.Publish('nav/next');
		}
		else if (entry.hasClass('unread')) _toggleUnread();
	},

	_scrollEntryToView = function (entry, callback) {
		var dist, animSpeed = 'fast';
		if (!entry || !entry.length) {
			animSpeed = 0;
			entry = entry || _container.find('.entry').first();
		}
		dist = entry[0].offsetTop;
		_body.animate({ scrollTop: dist }, animSpeed);
		setTimeout(callback || function () {}, animSpeed);
	},

	_getById = function (id) {
		var i = 0, item;
		for (; item = _items[i++] ;) if (item.id === id) return item;
		return null;
	},
	/*** HANDLERS *****************************************************************************************************/

	_getItemHtml = function (item) {
		var cls = [ 'entry' ];
		if (item.is_unread === 1) cls.push('unread');
		if (item.is_starred === 1) cls.push('starred');

		return '<div id="entry' + item.id + '" class="' + cls.join(' ') + '" data-id="' + item.id + '">' +
		'<div class="entry-header">' +
			'<h3><a href="' + item.url + '" target="_blank">' + item.title + '</a></h3>' +
			'<span class="entry-time">' + item.datetime + '</span>' +
			'<span class="entry-source">from ' +
				'<a href="#' + _params.status + '/src/' + item.source.id + '" class="entry-source entry-source-' +
					item.source.id + '">' + item.source.name + '</a>' +
			'</span>' +
		'</div>' +
		'<div class="entry-body">' + item.content + '</div>' +
		'<div class="entry-footer">' +
			'<div class="pull-right">' +
				'<span class="tb-btn btn-expand expand" data-action="toggle-expand" title="Expand">' +
					'<i class="icon-double-angle-down"></i></span>' +
				'<span class="tb-btn btn-expand collapse" data-action="toggle-expand" title="Collapse">' +
					'<i class="icon-double-angle-up"></i></span>' +
			'</div>' +

			'<span class="tb-btn addstar" data-action="toggle-star" title="Star Item (s)">' +
				'<i class="icon-star-empty"></i></span>' +
			'<span class="tb-btn unstar" data-action="toggle-star" title="Unstar Item (s)">' +
				'<i class="icon-star"></i></span>' +
			'<span class="tb-btn mark-unread" data-action="toggle-unread" title="Mark as Unread (u)">' +
				'<i class="icon-ok-sign"></i>mark as unread</span>' +
			'<span class="tb-btn mark-read" data-action="toggle-unread" title="Mark as Read (u)">' +
				'<i class="icon-ok-circle"></i>mark as read</span>' +
		'</div>' +
		'</div>';
	},

	_populate = function (items) {
		if (!items || !items.length) {
			_btnRefresh.removeClass('icon-spin');
			return _container.html('');
		}
		_items = items;
		var i = 0, item, itemAr = [];
		for (; item = items[i++] ;) itemAr.push(_getItemHtml(item));
		_container.html(itemAr);
		_scrollEntryToView();
		_btnRefresh.removeClass('icon-spin');
		_maxBodyHeight = parseInt(_container.find('.entry .entry-body').first().css('max-height'), 10);
	},


	_load = function (cfg) {
		if (!_isReady || !cfg) return;
		_params = cfg;
		_btnRefresh.addClass('icon-spin');
		App.Get('items?' + $.param(cfg), _populate);
	},



	_init = function () {
		if (_isReady) return;
		_container = $('#content.unreaditems');
		if (!_container.length) return;
		_body = $('html,body');
		_btnRefresh = $('#toolbar .icon-repeat');

		_container
			.on('click', '.entry', _entryClickHandler)
			.on('click', '.tb-btn', _btnClickHandler);

		_isReady = true;
	};

	App.Subscribe('entry/allread', _markAllAsRead);
	App.Subscribe('entry/toggleStar', _toggleStar);
	App.Subscribe('entry/toggleUnread', _toggleUnread);

	App.Subscribe('nav/next', _nextItem);
	App.Subscribe('nav/prev', _previousItem);

	App.Subscribe('nav/refresh', _load);
	App.Subscribe('app/ready', _init);

}(jQuery, window.App, this));
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
		if (key === 83) App.Publish('entry/toggleStar');				// s - toggle unread
		else if (key === 85) App.Publish('entry/toggleUnread');			// u - toggle unread
		else if (key === 82) App.Publish('nav/refresh', [ _params ]);	// r - refresh
		else if (key === 32) App.Publish('nav/next');					// space - next
		else if (key === 33) App.Publish('nav/prev');					// pgup - prev
		else if (key === 34) App.Publish('nav/next');					// pgdown - next
	},

	_toolbarBtnHandler = function () {
		var btn = $(this), action = btn.data('action');

		if (action === 'next') App.Publish('nav/next');
		if (action === 'prev') App.Publish('nav/prev');
		if (action === 'refresh') App.Publish('nav/refresh', [ _params ]);

		if (action === 'unread') _navigate({ status: 'unread' });
		if (action === 'starred') _navigate({ status: 'starred' });
		if (action === 'archive') _navigate({ status: 'archive' });
		if (action === 'all-read') App.Publish('entry/allread', [ _params ]);


		if (action === 'add') App.Publish('source/add');
		if (action === 'settings') window.location.href = App.rootPath + '/settings';
		if (action === 'logout') window.location.href = App.rootPath + '/logout';
		if (action === 'back') window.location.href = App.rootPath;
	},

	_sidebarClickHandler = function (e) {
		e.preventDefault();
		var btn = $(this), type = btn.data('navType'), id = btn.data('action');
		_params = { status: _params.status };
		if (type === 'unread') _params.status = 'unread';
		if (type === 'tag') _params.tag = id;
		if (type === 'src') _params.src = id;
		_navigate();
	},
	/*** EVENT LISTENERS **********************************************************************************************/


	_navigate = function (cfg) {
		if (cfg) $.extend(_params, cfg);
		var hash = [_params.status], oldHash = window.location.hash.substr(1), newHash;
		if (_params.tag) hash.push('tag', _params.tag);
		else if (_params.src) hash.push('src', _params.src);
		newHash = hash.join('/');
		if (newHash !== oldHash) window.location.hash = newHash;
		else App.Publish('nav/refresh', [ _params ]);
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
	_populateSources = function (sources) {
		if (typeof sources !== 'undefined') _items = sources;

		var i = 0, tag, src, j, elems = _sourcesContainer.find('.nav-source'), row;
		for (; tag = _items[i++] ;) {
			if (!tag.items) continue;
			for (j = 0; src = tag.items[j++] ;) {
				row = elems.filter('.nav-' + src.id);
				if (src.unread) row.show().find('.no-badge').html(src.unread);
				else row.hide().find('.no-badge').html('');
			}
		}

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
		if (!_isReady) return;   // don't fetch on init as these are already populated in html
		$.extend(_params, cfg);
		if (_sourcesContainer.length) App.Get('sourcetree?' + $.param(_params), _populateSources);
		_loadStats();
	},
	/*** LOAD DATA ****************************************************************************************************/






	_init = function () {
		if (_isReady) return;
		_sidebar = $('#sidebar');
		_toolbar = $('#toolbar, #sideToolbar');

		if (!_sidebar.length && !_toolbar.length) return;
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
(function ($, App) {
	'use strict';

	var _container = null,
		_isReady = false,
		_items = [],



	/*** EVENT LISTENERS ********************************************************************************************************/
	_entryDoubleClick = function () {
		var entry = $(this).closest('.entry'), item = _getById(entry.data('id'));
		_editStart(entry, item);
	},

	_btnClickHandler = function (e) {
		var btn = $(this),
			action = btn.data('action'),
			entry = btn.closest('.entry'),
			item = _getById(entry.data('id'));

		if (action === 'edit') _editStart(entry, item);
		else if (action === 'remove') _removeSource(entry, item);
		else if (action === 'cancel') _editStop(entry, item);
		else if (action === 'save') _editSave(entry, item);
		e.stopPropagation();
	},

	_onKeyUp = function (e) {
		var key = e.keyCode, entry = _container.find('.entry.in-edit').first(), item = _getById(entry.data('id'));

		if (key === 27) _editStop(entry, item);
		else if (key === 13) _editSave(entry, item);
	},
	/*** EVENT LISTENERS ********************************************************************************************************/



	/*** HANDLERS ***************************************************************************************************************/
	_addSource = function () {
		if (!_container.find('.new-item').length) _container.prepend(_getSourceEditHtml());
		_container.find('.in-edit input[name="name"]').focus();
	},

	_editStart = function (entry, item) {
		entry.replaceWith(_getSourceEditHtml(item));
		_container.find('.in-edit input[name="name"]').focus();
	},

	_editStop = function (entry, item) {
		if (item) entry.replaceWith(_getSourceHtml(item));
		else entry.remove();
	},

	_editSave = function (entry, item) {
		var form = entry.find('form'), newItem = form.formParams(true);

		if (item) $.extend(item, newItem);
		else item = newItem;
		if (item.id) App.Put('sources/' + item.id, newItem, function () { _editStop(entry, item); });
		else {
			App.Post('sources', newItem, function (resp) {
				$.extend(item, resp);
				_items.push(item);
				_editStop(entry, item);
			});
		}
	},

	_removeSource = function (entry, item) {
		if (!window.confirm('Are you sure you want to remove: ' + item.name)) return;
		App.Delete('sources/' + item.id, function (resp) {
			if (resp.result !== 'success') return;
			entry.remove();
			_items = App.UTIL.removeFromArray(_items, item);
		});
	},
	/*** HANDLERS ***************************************************************************************************************/




	_getSourceHtml = function (src) {
		src = src || {};
		if (src.created_at && src.created_at.date) src.created_at = src.created_at.date;
		if (src.updated_at && src.updated_at.date) src.updated_at = src.updated_at.date;
		return '<div class="entry" data-id="' + (src.id || '') + '">' +
			'<div class="entry-header">' +
				'<h3>' +
					(src.icon ? '<img src="../storage/favicons/' + src.id + '.png"> ' : '') +
					(src.name || '') +
					(src.tag ? ' &lt;' + src.tag + '&gt;' : '') +
				'</h3>' +
				'<span class="entry-time">updated: ' + (src.updated_at || '') + '</span>' +
				'<span class="entry-source">' + (src.url || '') + '</span>' +
			'</div>' +
			(src.last_error ? '<div class="entry-body"><p class="error">' + src.last_error + '</p></div>' : '') +
			'<div class="entry-footer">' +
				'<span class="tb-btn btn-remove" data-action="remove"><i class="icon-trash"></i> Remove</span>' +
				'<span class="tb-btn btn-edit"   data-action="edit"><i class="icon-pencil"></i> Edit</span>' +
			'</div>' +
		'</div>';
	},

	_getSourceEditHtml = function (src) {
		src = src || {};
		return '<div class="entry in-edit ' + (src.id ? '' : 'new-item') + '" data-id="' + (src.id || '') + '"><form>' +
			'<div class="entry-header">' +
				'<h3>' +
					'<input name="name" value="' + (src.name || '') + '" placeholder="name">' +
					'<input name="tag" value="' + (src.tag || '') + '" placeholder="tag">' +
				'</h3>' +
				'<span class="entry-time">added: ' + (src.created_at || '') + '</span>' +
				'<span class="entry-source"><input name="url" value="' + (src.url || '') + '" placeholder="url"></span>' +
			'</div>' +
			'<div class="entry-footer">' +
				'<span class="tb-btn btn-save"   data-action="save"><i class="icon-save"></i> Save</span>' +
				'<span class="tb-btn btn-cancel" data-action="cancel"><i class="icon-remove"></i> Cancel</span>' +
			'</div>' +
		'</form></div>';
	},

	_getById = function (id) {
		var i = 0, item;
		for (; item = _items[i++] ;) if (item.id === id) return item;
		return null;
	},


	_populate = function (data) {
		if (!data || !data.length) return;
		_items = data;
		var i = 0, item, html = [];
		for (; item = _items[i++] ;) html.push(_getSourceHtml(item));
		_container.html(html.join(''));
	},

	_load = function () { App.Get('sources', _populate);	},



	_init = function () {
		if (_isReady) return;
		_container = $('#content.settings');
		if (!_container.length) return;

		_container.on('click', '.tb-btn', _btnClickHandler);
		_container.on('dblclick', '.entry', _entryDoubleClick);

		$(document).on('keydown', _onKeyUp);

		_load();
		_isReady = true;
	};

	App.Subscribe('source/add', _addSource);
	App.Subscribe('app/ready', _init);

}(jQuery, window.App, this));
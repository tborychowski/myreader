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

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
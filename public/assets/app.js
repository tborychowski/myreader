/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./public/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var sidebar = _interopRequire(__webpack_require__(1));

	sidebar.init();

	var main = _interopRequire(__webpack_require__(9));

	main.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var el,
	    isReady = false;

	function load() {}

	function init() {
		if (!isReady) {
			el = $("#sidebar");
		}

		load();
		isReady = true;
	}

	module.exports = {
		init: init
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var sizzle = _interopRequire(__webpack_require__(4));

	var ajax = _interopRequire(__webpack_require__(6));

	var form = _interopRequire(__webpack_require__(7));

	var pubsub = _interopRequire(__webpack_require__(3));

	var keys = _interopRequire(__webpack_require__(8));

	var util = _interopRequire(__webpack_require__(5));

	var all = { ajax: ajax, form: form };
	Object.assign(all, ajax, pubsub, keys, util);
	for (var prop in all) {
	  sizzle[prop] = all[prop];
	}module.exports = sizzle;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

	var _cache = {};

	function trigger(topic) {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		if (!_cache[topic]) {
			return;
		}_cache[topic].forEach(function (cb) {
			return cb.apply(cb, args);
		});
	}

	function on(topic, callback) {
		if (!_cache[topic]) _cache[topic] = [];
		_cache[topic].push(callback);
		return [topic, callback];
	}

	function off(handle) {
		var _handle = _slicedToArray(handle, 2);

		var topic = _handle[0];
		var cb = _handle[1];var ca = _cache[topic];
		cb = cb.toString();
		if (ca) ca.forEach(function (fn, i) {
			if (fn.toString() === cb) ca.splice(i, 1);
		});
	}

	module.exports = { on: on, off: off, trigger: trigger };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var util = _interopRequire(__webpack_require__(5));

	function sizzle(mixed, context) {
		if (!mixed) {
			return [];
		}var el;
		if (typeof mixed !== "string") el = mixed;else if (/<[a-z][\s\S]*>/i.test(mixed)) {
			el = new DOMParser().parseFromString(mixed, "text/html").body.firstChild;
		} else el = (context || document).querySelectorAll(mixed);

		if (el.nodeType) el = [el];else if (util.isNodeList(el)) el = Array.prototype.slice.call(el);

		return Object.assign(el || [], sizzle.fn);
	}

	sizzle.fn = {};
	sizzle.fn.find = function (selector) {
		return sizzle(selector, this[0]);
	};
	sizzle.fn.filter = function (selector) {
		var elems = Array.prototype.filter.call(this, function (el) {
			return el.matches(selector);
		});
		return sizzle(elems);
	};

	sizzle.fn.first = function () {
		return sizzle(this[0]);
	};
	sizzle.fn.last = function () {
		return sizzle(this[this.length - 1]);
	};
	sizzle.fn.eq = function (idx) {
		return sizzle(this[idx || 0]);
	};

	sizzle.fn.appendTo = function (parent) {
		if (!this || !this.length) return this;
		if (typeof parent === "string") parent = sizzle(parent);
		parent[0].appendChild(this[0]);
		return this;
	};

	sizzle.fn.append = function (child) {
		if (!this || !this.length) return this;
		if (typeof child === "string") child = sizzle(child);
		this[0].appendChild(child[0]);
		return this;
	};

	sizzle.fn.on = function (eventName, cb) {
		if (!this || !this.length) return this;
		this.forEach(function (el) {
			el.addEventListener(eventName, cb);
		});
		return this;
	};

	sizzle.fn.off = function (eventName, cb) {
		if (!this || !this.length) return this;
		this.forEach(function (el) {
			el.removeEventListener(eventName, cb);
		});
		return this;
	};

	sizzle.fn.closest = function (cls) {
		if (!this || !this.length) return false;
		var has = false,
		    el = this[0];
		while (!has && el) {
			has = el.matches(cls);
			if (has) return sizzle(el);
			el = el.parentNode;
			if (el.tagName === "HTML") return null;
		}
		return null;
	};

	sizzle.fn.is = function (selector) {
		if (!this || !this.length) return false;
		return this[0].matches(selector);
	};

	sizzle.fn.isIn = function () {
		for (var _len = arguments.length, classes = Array(_len), _key = 0; _key < _len; _key++) {
			classes[_key] = arguments[_key];
		}

		var target = this && this.length ? this : null;
		if (target) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = classes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var cls = _step.value;
					if (target.closest(cls)) return true;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
		return false;
	};

	function modElCls(el, action, cls, cond) {
		if (!el || !el.length) {
			return el;
		}cls = cls.split(" ");
		if (typeof cond === "boolean") {
			el.forEach(function (el) {
				cls.forEach(function (c) {
					el.classList[action](c, cond);
				});
			});
		} else {
			el.forEach(function (el) {
				cls.forEach(function (c) {
					el.classList[action](c);
				});
			});
		}
		return el;
	}

	sizzle.fn.addClass = function (cls) {
		return modElCls(this, "add", cls);
	};
	sizzle.fn.removeClass = function (cls) {
		return modElCls(this, "remove", cls);
	};
	sizzle.fn.toggleClass = function (cls, cond) {
		return modElCls(this, "toggle", cls, cond);
	};
	sizzle.fn.hasClass = function (cls) {
		if (!this || !this.length) return false;
		return this[0].classList.contains(cls);
	};

	sizzle.fn.html = function (html) {
		if (!this || !this.length) return this;
		this.forEach(function (el) {
			el.innerHTML = html;
		});
		return this;
	};

	sizzle.fn.remove = function () {
		if (!this || !this.length) return this;
		this.forEach(function (el) {
			el.remove();
		});
		return this;
	};

	sizzle.fn.data = function (key) {
		if (!this || !this.length) return this;
		if (!this[0].dataset) return null;
		if (key) return this[0].dataset[key];
		return this[0].dataset;
	};

	module.exports = sizzle;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	function type(obj) {
		return obj ? Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() : "undefined";
	}

	function isNumber(v) {
		if (typeof v === "number") {
			return true;
		}if (typeof v !== "string") {
			return false;
		}return /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/.test(v);
	}

	function formatNumber(num) {
		return num.toLocaleString("en-GB", { minimumFractionDigits: 2 });
	}

	function serialize(obj) {
		var keys = Object.keys(obj);
		if (!keys || !keys.length) {
			return "";
		}return "?" + keys.reduce(function (a, k) {
			a.push(k + "=" + encodeURIComponent(obj[k]));
			return a;
		}, []).join("&");
	}

	function varToRealType(v) {
		if (isNumber(v)) {
			var originalv = v;
			v = parseFloat("" + v);
			if ("" + v !== originalv) v = originalv;
		} else if (v === "true") v = true;else if (v === "false") v = false;
		if (v === "") v = undefined;
		if (type(v) === "array") v = v.map(function (val) {
			return varToRealType(val);
		});
		return v;
	}

	function isObjectEmpty(x) {
		if (!x || typeof x !== "object") {
			return true;
		}return Object.keys(x).length === 0;
	}

	function rand(max) {
		var min = arguments[1] === undefined ? 0 : arguments[1];

		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function each(arr, cb, scope) {
		if (!arr) {
			return;
		}if (type(arr) === "object") for (var key in arr) cb.call(scope || cb, arr[key], key);else for (var i = 0, item; item = arr[i]; i++) cb.call(scope || cb, item, i);
	}

	function sanitize(v) {
		var div = document.createElement("DIV");
		div.innerHTML = v || "";
		return div.textContent || div.innerText || "";
	}

	function merge(target) {
		for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			sources[_key - 1] = arguments[_key];
		}

		if (!target) throw new TypeError("Cannot convert first argument to object");
		var to = Object(target);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var source = _step.value;

				var keys = Object.keys(Object(source));
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var key = _step2.value;

						var desc = Object.getOwnPropertyDescriptor(source, key);
						if (desc !== undefined && desc.enumerable) to[key] = source[key];
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
							_iterator2["return"]();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return to;
	}

	if (!Object.assign) Object.defineProperty(Object, "assign", { value: merge,
		enumerable: false, configurable: true, writable: true
	});

	function isNodeList(nodes) {
		return typeof nodes === "object" && /^(htmlcollection|nodelist|object)$/.test(type(nodes)) && (nodes.length === 0 || typeof nodes[0] === "object" && nodes[0].nodeType > 0);
	}

	module.exports = {
		type: type,
		rand: rand,
		each: each,
		isNumber: isNumber,
		formatNumber: formatNumber,
		varToRealType: varToRealType,
		isObjectEmpty: isObjectEmpty,
		merge: merge,
		sanitize: sanitize,
		serialize: serialize,
		isNodeList: isNodeList,
		months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var util = _interopRequire(__webpack_require__(5));

	var base_url = "api/";

	function ajax(options) {
		if (typeof options === "string") options = { url: options };

		var req = new XMLHttpRequest(),
		    resp,
		    data = options.data || "";
		options.url = base_url + options.url;
		options.method = options.method || "GET";
		options.type = options.type || "json";

		if (data) {
			if (options.method.toLowerCase() === "get") options.url += util.serialize(data);else if (options.type === "json") data = JSON.stringify(data);
		}
		return new Promise(function (resolve, reject) {
			req.open(options.method, options.url, true);
			req.onload = function () {
				if (req.status >= 200 && req.status < 400) {
					resp = req.responseText;
					try {
						resp = JSON.parse(resp);
					} catch (e) {}
					resolve(resp);
				} else reject(req.statusText);
			};
			req.onerror = function () {
				reject(req.statusText);
			};
			req.setRequestHeader("Content-Type", "application/" + options.type + "; charset=UTF-8");
			req.send(data);
		});
	}

	module.exports = {
		ajax: ajax,
		get: function (url, data) {
			return ajax({ url: url, data: data || {} });
		},
		post: function (url, data) {
			return ajax({ url: url, data: data || {}, method: "POST" });
		},
		put: function (url, data) {
			return ajax({ url: url, data: data || {}, method: "PUT" });
		},
		del: function (url, data) {
			return ajax({ url: url, data: data || {}, method: "DELETE" });
		} };

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var keyBreaker = /[^\[\]]+/g;
	var numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

	function _isNumber(value) {
		if (typeof value === "number") {
			return true;
		}if (typeof value !== "string") {
			return false;
		}return value.match(numberMatcher);
	}

	function _decodeEntities(str) {
		var d = document.createElement("div");
		d.innerHTML = str;
		return d.innerText || d.textContent;
	}

	function _getInputs(form) {
		var inputs = form.querySelectorAll("[name]");
		return Array.prototype.slice.call(inputs) || [];
	}

	function Form(el) {
		if (!el) {
			return null;
		}if (!(this instanceof Form)) {
			return new Form(el);
		}this.form = el;
		if (el.elements) this.inputs = el.elements;
	}

	Form.prototype.set = function (params, clear) {
		var inputs = _getInputs(this.form);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var input = _step.value;

				var name = input.name,
				    value = typeof params[name] === "undefined" ? "" : params[name];

				if (name.indexOf("[") > -1) {
					var v = params;
					var names = name.replace(/[\[\]]/g, "|").split("|");
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = names[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var n = _step2.value;

							if (v[n]) v = v[n];else {
								v = undefined;break;
							}
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
								_iterator2["return"]();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					value = v;
				}

				if (clear !== true && value === undefined) return;

				if (value === null || value === undefined) value = "";

				if (typeof value === "string" && value.indexOf("&") > -1) value = _decodeEntities(value);

				if (input.type === "radio") input.checked = input.value.toString() === value.toString();else if (input.type === "checkbox") input.checked = value;else if (input.tagName === "SELECT") {
					if (value === "" || value === undefined) input.selectedIndex = 0;else input.value = value;
				} else input.value = value;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return this;
	};

	Form.prototype.get = function () {
		var convert = arguments[0] === undefined ? false : arguments[0];

		var inputs = _getInputs(this.form),
		    data = {},
		    current;

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var input = _step.value;

				var type = input.type && input.type.toLowerCase(),
				    value = undefined,
				    parts = undefined,
				    lastPart = undefined,
				    last = undefined;

				if (type === "submit" || !input.name || input.disabled) return;

				value = input.value;
				parts = input.name.match(keyBreaker);

				if (type === "radio" && !input.checked) return;

				if (type === "checkbox") value = input.checked;

				if (convert) {
					if (_isNumber(value)) {
						var tv = parseFloat(value);
						var cmp = tv + "";

						if (value.indexOf(".") > 0) cmp = tv.toFixed(value.split(".")[1].length);
						if (cmp === value) value = tv;
					} else if (value === "true") value = true;else if (value === "false") value = false;
					if (value === "") value = null;
				}

				current = data;

				for (var i = 0; i < parts.length - 1; i++) {
					current[parts[i]] = current[parts[i]] || {};
					current = current[parts[i]];
				}
				lastPart = parts[parts.length - 1];

				last = current[lastPart];
				if (last) {
					if (!Array.isArray(last)) current[lastPart] = last === undefined ? [] : [last];
					current[lastPart].push(value);
				} else current[lastPart] = value;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return data;
	};

	Form.prototype.reset = function () {
		this.set({});
	};

	Form.prototype.clear = function () {
		this.set({}, true);
	};

	Form.prototype.update = function () {
		if (!this.observeCb) return;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.form.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var field = _step.value;

				var fname = field.name.replace(/[\[\]]/g, "_") + "val",
				    ov = this.form.dataset[fname],
				    v = field.value;
				if (fname === "val") continue;
				if (field.type === "checkbox") {
					v = field.checked;
					ov = ov === "true";
				} else if (field.type === "radio" && !field.checked) continue;
				if (typeof ov === "undefined" && typeof v !== "undefined") {
					if (field.type === "radio") this.observeCb(v, ov, field);
					ov = this.form.dataset[fname] = v;
				} else if (ov !== v) {
					this.form.dataset[fname] = v;
					this.observeCb(v, ov, field);
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		requestAnimationFrame(this.update.bind(this));
	};
	Form.prototype.observe = function (cb) {
		this.update(this.observeCb = cb);
	};
	Form.prototype.observeStop = function () {
		this.observeCb = null;
	};

	module.exports = Form;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	var keys = {
		BCKSPC: 8,
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		ESC: 27,
		SPACE: 32,
		PGUP: 33,
		PGDOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		INS: 45,
		DEL: 46,
		A: 65,
		X: 88,
		C: 67,
		D: 68,
		V: 86,
		Z: 90,
		F1: 112,
		F2: 113,
		F5: 116,
		MINUS: 173,
		PLUS: 61,
		DOT: 190,
		SLASH: 191,

		NUMSTAR: 106,
		NUMMINUS: 109,
		NUMPLUS: 107,
		NUMDOT: 110,
		NUMSLASH: 111 },
	    digits = {
		48: 1,
		49: 1,
		50: 1,
		51: 1,
		52: 1,
		53: 1,
		54: 1,
		55: 1,
		56: 1,
		57: 1,
		96: 1,
		97: 1,
		98: 1,
		99: 1,
		100: 1,
		101: 1,
		102: 1,
		103: 1,
		104: 1,
		105: 1 },
	    allowedChars = {
		8: 1,
		9: 1,
		46: 1,
		35: 1,
		36: 1,
		37: 1,
		39: 1 };

	function isMath(e) {
		var k = e.keyCode;
		if (k === keys.SPACE) {
			return true;
		}if (k === keys.NUMDOT || k === keys.DOT && !e.shiftKey) {
			return true;
		}if (k === keys.NUMMINUS || k === keys.MINUS && !e.shiftKey) {
			return true;
		}if (k === keys.NUMPLUS || k === keys.PLUS && e.shiftKey) {
			return true;
		}if (k === keys.NUMSLASH || k === keys.SLASH && !e.shiftKey) {
			return true;
		}if (e.shiftKey) {
			if (k === 56 || k === 57 || k === 48) {
				return true;
			}
		}
		return false;
	}

	function isAllowed(e) {
		var k = e.keyCode,
		    allowed = allowedChars[k] === 1,
		    isCtrlXCV = e && e.ctrlKey === true && (k === keys.X || k === keys.C || k === keys.V),
		    math = isMath(e);
		return isDigit(e) || allowed || isCtrlXCV || math;
	}

	function isDigit(e) {
		return digits[e.keyCode] === 1 && !e.shiftKey;
	}

	function isAlpha(e) {
		return e.keyCode >= 65 && e.keyCode <= 90 && !e.ctrlKey;
	}

	function isAlphaNumeric(e) {
		return isAlpha(e) || isDigit(e);
	}

	module.exports = {
		keys: keys,
		isAllowed: isAllowed,
		isDigit: isDigit,
		isAlpha: isAlpha,
		isAlphaNumeric: isAlphaNumeric
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var Data = _interopRequire(__webpack_require__(10));

	var el,
	    isReady = false;

	function load() {
		Data.getUnread().then(function (data) {
			console.log(data);
		});
	}

	function init() {
		if (!isReady) {
			el = $("#main");
		}

		load();
		isReady = true;
	}

	module.exports = {
		init: init
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var _url = "articles";

	module.exports = {
		getUnread: function (params) {
			return $.get(_url, params || {});
		} };

/***/ }
/******/ ]);
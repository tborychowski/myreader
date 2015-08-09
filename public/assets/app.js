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

	var nav = _interopRequire(__webpack_require__(1));

	nav.init();

	var events = _interopRequire(__webpack_require__(10));

	events.init();

	var toolbar = _interopRequire(__webpack_require__(11));

	toolbar.init();

	var sidebar = _interopRequire(__webpack_require__(12));

	sidebar.init();

	var main = _interopRequire(__webpack_require__(13));

	main.init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var Hash = _interopRequire(__webpack_require__(9));

	var isReady = false;

	function _init() {

		if (!isReady) {

			Hash.init(function () {
				$.trigger("nav/changed", this);
			});

			if (Hash.section) $.trigger("nav/changed", Hash);else Hash.hash = "unread";
		}

		isReady = true;
	}

	module.exports = {
		init: function init() {
			setTimeout(_init, 100);
		}
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

	sizzle.fn.prev = function (cls) {
		if (!this || !this.length) return false;
		var has = false,
		    el = this[0];
		if (!el) return null;
		el = el.previousElementSibling;
		while (!has && el) {
			has = el.matches(cls);
			if (has) return sizzle(el);
			el = el.previousElementSibling;
			if (!el || el.tagName === "HTML") return null;
		}
		return null;
	};

	sizzle.fn.next = function (cls) {
		if (!this || !this.length) return false;
		var has = false,
		    el = this[0];
		if (!el) return null;
		el = el.nextElementSibling;
		while (!has && el) {
			has = el.matches(cls);
			if (has) return sizzle(el);
			el = el.nextElementSibling;
			if (!el || el.tagName === "HTML") return null;
		}
		return null;
	};

	sizzle.fn.siblings = function (selector) {
		if (!this || !this.length) return false;
		var elems = sizzle(this[0].parentNode.children);
		if (selector) return elems.filter(selector);
		return elems;
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

	sizzle.fn.style = function (prop) {
		if (!this || !this.length) return this;
		var style = this[0].currentStyle || window.getComputedStyle(this[0]);
		if (!prop) return style;
		var nums = {
			margin: 1, marginTop: 1, marginLeft: 1, marginBottom: 1, marginRight: 1,
			padding: 1, paddingTop: 1, paddingLeft: 1, paddingBottom: 1, paddingRight: 1,
			width: 1, height: 1
		};
		if (prop in nums) return parseFloat(style[prop]);
		return style[prop];
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

	var base_url = "/";

	function ajax(options) {
		if (typeof options === "string") options = { url: options };

		var req = new XMLHttpRequest(),
		    resp,
		    data = options.data || "";
		options.url = base_url + options.url;
		options.method = options.method || "GET";
		options.type = options.type || "application/json";

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
			req.setRequestHeader("Content-Type", options.type + "; charset=UTF-8");
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
/***/ function(module, exports) {

	"use strict";

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

	var Hash = {},
	    _hash = [],
	    _section = "",
	    _folder = "",
	    _id = "",
	    _cb = function _cb() {};

	Object.defineProperties(Hash, {
		init: {
			value: function value(cb) {
				window.onhashchange = this.parse.bind(this);
				this.parse(true);
				if (typeof cb === "function") _cb = cb;
			}
		},

		getHash: {
			value: function value() {
				var hash = [];
				if (_section) hash.push(_section);
				if (_folder) hash.push(_folder);
				if (_id) hash.push(_id);
				return hash.join("/");
			}
		},

		setHash: {
			value: function value(h) {
				if (typeof h === "string") {
					var _split = (h || "").split("/");

					var _split2 = _slicedToArray(_split, 3);

					var section = _split2[0];
					var folder = _split2[1];
					var id = _split2[2];

					h = { section: section, folder: folder, id: id };
				}
				if (h.section) _section = h.section;
				_folder = h.folder || null;
				_id = h.id || null;
				return this;
			}
		},
		apply: {
			value: function value(h) {
				if (h) this.hash = h;
				location.hash = this.getHash();
				return this;
			}
		},
		parse: {
			value: function value(initial) {
				this.hash = location.hash.replace(/^#/, "");

				if (initial !== true) _cb.call(this);

				return this;
			}
		},
		hash: {
			enumerable: true,
			get: function get() {
				_hash = this.getHash();return _hash;
			},
			set: function set(h) {
				return this.setHash(h).apply();
			}
		},

		section: {
			enumerable: true,
			get: function get() {
				return _section;
			},
			set: function set(s) {
				_section = s;this.apply();
			}
		},
		folder: {
			enumerable: true,
			get: function get() {
				return _folder;
			},
			set: function set(s) {
				_folder = s;this.apply();
			}
		},
		id: {
			enumerable: true,
			get: function get() {
				return _id;
			},
			set: function set(s) {
				_id = s;this.apply();
			}
		},

		toString: {
			value: function value() {
				return this.hash;
			}
		}
	});

	Object.freeze(Hash);

	module.exports = Hash;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var isReady = false,
	    resizeTimeout = null;

	function keyEvent(e) {
		var chr = String.fromCharCode(e.keyCode);
		return {
			event: e,
			letter: chr,
			key: e.keyCode,
			shift: e.shiftKey,
			ctrl: e.ctrlKey,
			alt: e.altKey
		};
	}

	function onResize() {
		if (resizeTimeout) clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(onResizeEnd, 300);
	}

	function onResizeEnd() {
		$.trigger("resizeend");
	}
	function onKeyUp(e) {
		$.trigger("keyup", keyEvent(e));
	}
	function onKeyDown(e) {
		$.trigger("keydown", keyEvent(e));
	}

	function init() {
		if (!isReady) {
			window.addEventListener("resize", onResize);
			window.addEventListener("keyup", onKeyUp);
			window.addEventListener("keydown", onKeyDown);
		}

		isReady = true;
	}

	module.exports = {
		init: init
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var el,
	    loadingBtn,
	    isReady = false;

	function eventHandler(e) {
		var el = $(e.target);
		var btn = el.closest(".btn");
		if (!btn || !btn.length) {
			return;
		}var action = btn.data("action");

		if (btn && action) {
			e.preventDefault();
			buttonAction(action, btn);
		}
	}

	function buttonAction(action) {
		if (action === "reload") {
			return $.trigger("data/reload");
		}if (action === "prev") {
			return $.trigger("nav/prev");
		}if (action === "next") {
			return $.trigger("nav/next");
		}
	}

	function handleLoading(loaded) {
		loadingBtn.toggleClass("spin", !loaded);
	}

	function init() {
		if (!isReady) {
			el = $(".toolbar");
			loadingBtn = el.find(".btn-loading");

			el.on("click", eventHandler);
			$.on("data/reload", handleLoading);
			$.on("data/changed", handleLoading);
		}

		isReady = true;
	}

	module.exports = {
		init: init
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var Hash = _interopRequire(__webpack_require__(9));

	var el,
	    tree,
	    unreadEl,
	    starredEl,
	    isReady = false;

	function updateBadge(el, c) {
		if (!el || !el.length) {
			return;
		}el[0].style.display = c ? "block" : "none";
		el.html(c);
	}

	function updateTree(sums) {
		tree.find(".visible").removeClass("visible");
		tree.find(".badge").html(0);

		for (var sid in sums) {
			var src = tree.find(".feed-" + sid);
			var badge = src.find(".badge");
			updateBadge(badge, sums[sid]);
			src.addClass("visible");
			var srcList = src.closest(".source-list");
			if (srcList) srcList.prev(".source-folder").addClass("visible");
		}
	}

	function calcSums(data) {
		var sums = {};

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = data.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var art = _step.value;

				var sid = art.source_id;
				sums[sid] = sums[sid] ? sums[sid] + 1 : 1;
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

		updateBadge(unreadEl, data.unread);
		updateBadge(starredEl, data.starred);
		updateTree(sums);
	}

	function clickHandler(e) {
		var target = $(e.target),
		    link = target.closest(".sidebar-link");
		if (link && link.length) {
			linkHandler(link);
			e.preventDefault();
		}
	}

	function linkHandler(link) {
		var data = link.data(),
		    oldHash = Hash.hash,
		    wrapper = data.section ? el : link.closest(".source-tree");

		wrapper.find(".sidebar-link.active").removeClass("active");
		Hash.hash = data;
		if (Hash.hash === oldHash) selectRows(Hash);
	}

	function selectRows(hash) {
		el.find(".label-" + hash.section + " .sidebar-link").addClass("active");

		if (hash.folder) {
			el.find(".folder-" + hash.folder + " .sidebar-link").addClass("active");
		}
		if (hash.id) {
			el.find(".feed-" + hash.id + " .sidebar-link").addClass("active");
		}
	}

	function init() {
		if (!isReady) {
			el = $(".home .sidebar");
			tree = el.find(".source-tree");
			unreadEl = el.find(".label-unread .badge");
			starredEl = el.find(".label-starred .badge");

			el.on("click", clickHandler);
			$.on("data/changed", calcSums);
			$.on("nav/changed", selectRows);
		}
		if (!el) {
			return;
		}isReady = true;
	}

	module.exports = {
		init: init
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var Data = _interopRequire(__webpack_require__(14));

	var Card = _interopRequire(__webpack_require__(15));

	var Hash = _interopRequire(__webpack_require__(9));

	var main,
	    el,
	    activeArticle,
	    currentSection,
	    filler,
	    isReady = false;

	function updateHeight() {
		if (!main || !main.length) {
			return;
		}var mainH = main[0].getBoundingClientRect().height;
		filler[0].style.height = mainH + "px";
	}

	function scrollTo(card) {
		card = card || activeArticle || null;
		if (!card) {
			return;
		}main[0].scrollTop = card[0].offsetTop - card.style("marginTop") + 2;
		activeArticle.removeClass("active");
		activeArticle = card.addClass("active");
	}

	function scrollToPrev() {
		var prev = activeArticle.prev(".card");
		if (prev) scrollTo(prev);
	}

	function scrollToNext() {
		var next = activeArticle.next(".card");
		if (next) {
			markAsRead(activeArticle);
			scrollTo(next);
		}
	}

	function openArticle() {
		var l = activeArticle.find(".card-title>a");
		if (l && l.length) l[0].click();
	}

	function markAsRead(article) {
		setTimeout(function () {
			Card.cardAction("unmark-unread", article);
		}, 300);
	}

	function onKeyUp(e) {
		if (e.letter === "P") $.trigger("nav/prev");else if (e.letter === "N") $.trigger("nav/next");else if (e.letter === "R") $.trigger("data/reload");else if (e.key === 13) $.trigger("nav/open");
	}

	function load() {
		if (currentSection === Hash.section) {
			return;
		}Data.get({ section: Hash.section }).then(function (data) {
			el.html(Card.card(data.items));

			var cards = el.find(".card");
			if (cards && cards.length) activeArticle = cards.first().addClass("active");
			scrollTo();
			currentSection = Hash.section;
			$.trigger("data/changed", data);
		});
	}

	function cardAction(action, card) {
		var id = card.data("id");
		if (!id) {
			return;
		}if (action === "unmark-unread") console.log("mark as read", id);
	}

	function init() {
		if (!isReady) {
			main = $(".home .main");
			if (!main) {
				return;
			}el = main.find(".home .articles");
			if (!el || !el.length) {
				return;
			}filler = main.find(".article-fill");

			$.on("resizeend", updateHeight);
			$.on("keyup", onKeyUp);

			$.on("nav/prev", scrollToPrev);
			$.on("nav/next", scrollToNext);
			$.on("nav/open", openArticle);
			$.on("nav/changed", load);

			$.on("card/action", cardAction);
			$.on("data/reload", load);
		}

		updateHeight();

		isReady = true;
	}

	module.exports = {
		init: init
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var $ = _interopRequire(__webpack_require__(2));

	var _url = "article";

	module.exports = {

		get: function (params) {
			return $.ajax({ url: _url, data: params });
		} };

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

	var $ = _interopRequire(__webpack_require__(2));

	var eventsReady = false;

	function cardAction(action, card) {
		var _action$split = action.split("-");

		var _action$split2 = _slicedToArray(_action$split, 2);

		var mark = _action$split2[0];
		var cls = _action$split2[1];

		var add = ({ mark: "add", unmark: "remove" })[mark];
		card[add + "Class"](cls);
		$.trigger("card/action", action, card);
	}

	function mainEventHandler(e) {
		var el = $(e.target);
		var card = el.closest(".card");
		if (!card || !card.length) {
			return;
		}var btn = el.closest(".card-footer .icon");

		if (btn) {
			e.preventDefault();
			var action = btn.data("action");
			cardAction(action, card);
		}
	}

	function initEvents() {
		if (eventsReady) {
			return;
		}$(".main").on("click", mainEventHandler);
		eventsReady = true;
	}

	function getCardHtml(row) {
		initEvents();
		var cls = ["card"];
		if (row.is_starred) cls.push("starred");
		if (row.is_unread) cls.push("unread");

		return "<div class=\"" + cls.join(" ") + "\" data-id=\"" + row.id + "\">\n\t\t\t<div class=\"card-header\">\n\t\t\t\t<span class=\"card-date\">" + row.published_at + "</span>\n\t\t\t\t<h2 class=\"card-title\"><a href=\"" + row.url + "\" target=\"_blank\">" + row.title + "</a></h2>\n\t\t\t\t<h3 class=\"card-subtitle\">from <a href=\"#\">source name " + row.source_id + "</a></h3>\n\t\t\t</div>\n\t\t\t<div class=\"card-body\">" + row.content + "</div>\n\t\t\t<div class=\"card-footer\">\n\t\t\t\t<a href=\"#\" data-action=\"mark-expanded\" class=\"btn-expand icon ion-ios-more icon-right\" title=\"Expand\"></a>\n\t\t\t\t<a href=\"#\" data-action=\"unmark-expanded\" class=\"btn-collapse icon ion-ios-close-empty icon-right\" title=\"Collapse\"></a>\n\n\t\t\t\t<a href=\"#\" data-action=\"mark-unread\" class=\"btn-mark-unread icon ion-ios-checkmark-outline\" title=\"Mark as unread\"></a>\n\t\t\t\t<a href=\"#\" data-action=\"unmark-unread\" class=\"btn-mark-read icon ion-ios-circle-filled\" title=\"Mark as read\"></a>\n\n\t\t\t\t<a href=\"#\" data-action=\"mark-starred\" class=\"btn-mark-starred icon ion-ios-star-outline\" title=\"Star\"></a>\n\t\t\t\t<a href=\"#\" data-action=\"unmark-starred\" class=\"btn-mark-unstarred icon ion-ios-star\" title=\"Unstar\"></a>\n\t\t\t</div>\n\t\t</div>";
	}

	function card(data) {
		if ($.type(data) === "array") {
			return data.map(getCardHtml).join("");
		}
		return getCardHtml(data);
	}

	module.exports = { cardAction: cardAction, card: card };

/***/ }
/******/ ]);
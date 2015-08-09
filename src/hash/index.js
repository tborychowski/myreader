/**
 * Location Hash manager/listener
 */

var Hash = {},
	_hash = [],
	_section = '',
	_folder = '',
	_id = '',
	_cb = function () {};


Object.defineProperties(Hash, {
	init: {
		value: function (cb) {
			window.onhashchange = this.parse.bind(this);
			this.parse(true);
			if (typeof cb === 'function') _cb = cb;
		}
	},

	getHash: {
		value: function () {
			var hash = [];
			if (_section) hash.push(_section);
			if (_folder) hash.push(_folder);
			if (_id) hash.push(_id);
			return hash.join('/');
		}
	},

	setHash: {
		value: function (h) {
			if (typeof h === 'string') {
				let [section, folder, id] = (h || '').split('/');
				h = { section, folder, id };
			}
			if (h.section) _section = h.section;
			_folder = h.folder || null;
			_id = h.id || null;
			return this;
		}
	},


	/**
	 * Apply to url
	 */
	apply: {
		value: function (h) {
			if (h) this.hash = h;
			location.hash = this.getHash();
			return this;
		}
	},

	/**
	 * Parse from url on change
	 */
	parse: {
		value: function (initial) {
			this.hash = location.hash.replace(/^#/, '');

			// trigger app event passing: this.hash
			if (initial !== true) _cb.call(this);

			return this;
		}
	},


	/*** Set blocks ***/
	hash: {
		enumerable: true,
		get: function () { _hash = this.getHash(); return _hash; },
		set: function (h) { return this.setHash(h).apply(); }
	},

	section: {
		enumerable: true,
		get: function () { return _section; },
		set: function (s) { _section = s; this.apply(); }
	},
	folder: {
		enumerable: true,
		get: function () { return _folder; },
		set: function (s) { _folder = s; this.apply(); }
	},
	id: {
		enumerable: true,
		get: function () { return _id; },
		set: function (s) { _id = s; this.apply(); }
	},

	toString: {
		value: function () { return this.hash; }
	}
});

Object.freeze(Hash);


export default Hash;

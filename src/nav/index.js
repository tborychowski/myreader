import $ from 'util';

var isReady = false,
	_originalHash = {
		big: 'unread',	// unread | starred | archive
		type: null,
		id: null
	},
	big = { starred: 1, archive: 1, unread: 1 },
	Hash = { hash: {} };


Hash.set = function (obj) {
	obj = obj || {};
	if (typeof obj === 'string') {
		if (obj.indexOf('#') === 0) obj = obj.substr(1);
		if (obj in big) obj = { big: obj };
		else {
			let [type, id] = obj.split('-');
			obj = { big: this.hash.big, type, id };
		}
	}

	// reset other fields when setting big stuff
	if (!obj.big || (obj.big && this.hash.big !== obj.big)) this.reset();
	Object.assign(this.hash, obj);

	return this.toUrl();
};

Hash.reset = function () {
	this.hash = Object.assign({}, _originalHash);
	return this;
};

Hash.toUrl = function () {
	var url = [this.hash.big];
	if (this.hash.type) url.push(this.hash.type);
	if (this.hash.id) url.push(this.hash.id);
	location.hash = url.join(',');

	// $.trigger('nav/changed', this.hash);
	return this;
};


Hash.parse = function (hash) {
	hash = hash || location.hash;
	if (hash.indexOf('#') === 0) hash = hash.substr(1);
	let [big, type, id] = hash.split(',');
	this.hash = { big, type, id };
	return this;
};



function _init () {
	if (!isReady) {
		Hash.parse();
		if (Hash.hash.big) $.trigger('nav/changed', Hash.hash);
		else Hash.set();

		window.onhashchange = function () {
			Hash.parse();
			$.trigger('nav/changed', Hash.hash);
		};
	}

	isReady = true;
}


export default {
	init: function () { setTimeout(_init, 100); },
	Hash
};

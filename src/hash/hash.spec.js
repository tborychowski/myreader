/* global beforeEach, describe, it */
import Hash from './index';
var assert = require('assert');

var s = 'all/folder/12', sarr = s.split('/');


if (typeof location === 'undefined') {
	global.location = {};
	var locationHash = '';
	Object.defineProperty(global.location, 'hash', {
		get: function () { return '#' + locationHash; },
		set: function (h) { locationHash = h; }
	});
}


beforeEach(function () {
	Hash.hash = '';
});


describe('Test empty', function () {
	it('should be empty', function () {
		assert.equal(Hash.toString(), '');
		assert.equal('' + Hash, '');
		assert.equal(Hash.hash, '');
	});
});


describe('Test not empty', function () {
	it('should not be empty', function () {
		Hash.hash = s;

		assert.equal(Hash.toString(), s);
		assert.equal('' + Hash, s);
		assert.equal(Hash.hash, s);
	});
});


describe('Test getting all props', function () {
	it('should GET hash block values correctly', function () {
		Hash.hash = s;

		assert.equal(Hash.hash, s);
		assert.equal(Hash.section, sarr[0]);
		assert.equal(Hash.folder, sarr[1]);
		assert.equal(Hash.id, sarr[2]);

	});
});


describe('Test setting all props', function () {
	it('should SET hash blocks correctly', function () {
		Hash.section = 'abc';
		assert.equal(Hash.section, 'abc');
		Hash.folder = 'abc';
		assert.equal(Hash.folder, 'abc');
		Hash.id = 123;
		assert.equal(Hash.id, 123);
		assert.equal(Hash.hash, 'abc/abc/123');
	});
});


describe('Test getting (parsing) the location.hash', function () {
	it('should GET the location.hash', function () {
		var s1 = 'a/b/c';
		location.hash = s1;					// set manually
		setTimeout(function () {			// give 100ms for the browser event
			assert.equal(Hash.hash, s1);
		}, 100);

	});
});


describe('Test setting the location.hash', function () {
	it('should SET the location.hash', function () {
		var s2 = 'a/b/c', l;
		Hash.apply(s2);
		l = location.hash.substr(1);
		assert.equal(l, s2);
	});
});



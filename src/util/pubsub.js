var _cache = {};

function trigger (topic, ...args) {
	if (!_cache[topic]) return;
	_cache[topic].forEach(cb => cb.apply(cb, args));
}

function on (topic, callback) {
	if (!_cache[topic]) _cache[topic] = [];
	_cache[topic].push(callback);
	return [topic, callback];       // handle for off
}

function off (handle) {
	let [topic, cb] = handle, ca = _cache[topic];
	cb = cb.toString();
	if (ca) ca.forEach((fn, i) => {
		if (fn.toString() === cb) ca.splice(i, 1);
	});
}


export default { on, off, trigger };

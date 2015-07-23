import util from './util';

const base_url = '/';

function ajax (options) {
	if (typeof options === 'string') options = { url: options };

	var req = new XMLHttpRequest(), resp, data = options.data || '';
	options.url = base_url + options.url;
	options.method = options.method || 'GET';
	options.type = options.type || 'application/json';

	if (data) {
		if (options.method.toLowerCase() === 'get') options.url += util.serialize(data);
		else if (options.type === 'json') data = JSON.stringify(data);
	}
	return new Promise((resolve, reject) => {
		req.open(options.method, options.url, true);
		req.onload = function () {
			if (req.status >= 200 && req.status < 400) {
				resp = req.responseText;
				try { resp = JSON.parse(resp); } catch(e) {}
				resolve(resp);
			}
			else reject(req.statusText);
		};
		req.onerror = function () { reject(req.statusText); };
		req.setRequestHeader('Content-Type', options.type + '; charset=UTF-8');
		req.send(data);

	});
}




export default {
	ajax,
	get  : (url, data) => ajax({ url, data: data || {} }),
	post : (url, data) => ajax({ url, data: data || {}, method: 'POST' }),
	put  : (url, data) => ajax({ url, data: data || {}, method: 'PUT' }),
	del  : (url, data) => ajax({ url, data: data || {}, method: 'DELETE' }),
};

import $ from 'util';

const _url = 'article';


export default {
	// getUnread: (params) => $.get(_url, params || {}),
	getUnread: (params) => $.ajax({ url: _url, data: params, type: 'text/html' }),

	// save: (params) => $.post(_url + (params.id ? '/' + params.id : ''), params),

	// del: (id) => $.del(_url + '/' + id)
};

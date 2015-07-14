import $ from 'util';

const _url = 'articles';


export default {
	getUnread: (params) => $.get(_url, params || {}),

	// save: (params) => $.post(_url + (params.id ? '/' + params.id : ''), params),

	// del: (id) => $.del(_url + '/' + id)
};

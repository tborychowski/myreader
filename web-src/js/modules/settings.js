(function ($, App) {
	'use strict';

	var _container = null,
		_sidebar = null,
		_updateRequest = null,
		_isReady = false,
		_items = [],



	/*** EVENT LISTENERS **********************************************************************************************/
	_entryDoubleClick = function () {
		var entry = $(this).closest('.entry'), item = _getById(entry.data('id'));
		_editStart(entry, item);
	},

	_btnClickHandler = function (e) {
		var btn = $(this),
			action = btn.data('action'),
			entry = btn.closest('.entry'),
			item = _getById(entry.data('id'));

		e.stopPropagation();

		if (action === 'edit') _editStart(entry, item);
		else if (action === 'remove') _removeSource(entry, item);
		else if (action === 'cancel') _editStop(entry, item);
		else if (action === 'save') _editSave(entry, item);

		else if (action === 'update-all') _updateAllFeeds(btn);
	},

	_onKeyUp = function (e) {
		var key = e.keyCode, entry = _container.find('.entry.in-edit').first(), item = _getById(entry.data('id'));

		if (key === 27) _editStop(entry, item);
		else if (key === 13) _editSave(entry, item);
	},
	/*** EVENT LISTENERS **********************************************************************************************/





	/*** HANDLERS *****************************************************************************************************/
	_addSource = function () {
		if (!_container.find('.new-item').length) _container.prepend(_getSourceEditHtml());
		_container.find('.in-edit input[name="url"]').focus();
	},

	_editStart = function (entry, item) {
		entry.replaceWith(_getSourceEditHtml(item));
		_container.find('.in-edit input[name="url"]').focus();
	},

	_editStop = function (entry, item) {
		if (item) entry.replaceWith(_getSourceHtml(item));
		else entry.remove();
	},

	_editSave = function (entry, item) {
		var form = entry.find('form'), newItem = form.formParams(true);

		if (item) $.extend(item, newItem);
		else item = newItem;
		if (item.id) App.Put('sources/' + item.id, newItem, function () { _editStop(entry, item); });
		else {
			App.Post('sources', newItem, function (resp) {
				$.extend(item, resp);
				_items.push(item);
				_editStop(entry, item);
			});
		}
	},

	_removeSource = function (entry, item) {
		if (!window.confirm('Are you sure you want to remove: ' + item.name)) return;
		App.Delete('sources/' + item.id, function (resp) {
			if (resp.result !== 'success') return;
			entry.remove();
			_items = App.UTIL.removeFromArray(_items, item);
		});
	},

	_getById = function (id) {
		var i = 0, item;
		for (; item = _items[i++] ;) if (item.id === id) return item;
		return null;
	},

	_showUpdateLoading = function (btn, show) {
		var ico = btn.find('i').addClass('icon-spin'), text = btn.find('span');
		if (show) {
			ico.addClass('icon-spin');
			text.html('Cancel update');
		}
		else {
			ico.removeClass('icon-spin');
			text.html('Update now');
		}
	},
	/*** HANDLERS *****************************************************************************************************/







	/*** HTML *********************************************************************************************************/
	_getSourceHtml = function (src) {
		src = src || {};
		if (src.created_at && src.created_at.date) src.created_at = src.created_at.date;
		if (src.updated_at && src.updated_at.date) src.updated_at = src.updated_at.date;
		return '<div class="entry" data-id="' + (src.id || '') + '">' +
			'<div class="entry-header">' +
				'<h3>' +
					(src.icon ? '<img src="img/favicons/' + src.id + '.png"> ' : '') +
					(src.name || '') +
					(src.tag ? ' &lt;' + src.tag + '&gt;' : '') +
				'</h3>' +
				'<span class="entry-source">' + (src.url || '') + '</span>' +
			'</div>' +
			(src.last_error ? '<div class="entry-body"><p class="error">' + src.last_error + '</p></div>' : '') +
			'<div class="entry-footer">' +
				'<span class="pull-right entry-time">updated: ' + (src.updated_at || '') + '</span>' +
				'<span class="tb-btn btn-remove" data-action="remove"><i class="icon-trash"></i> Remove</span>' +
				'<span class="tb-btn btn-edit"   data-action="edit"><i class="icon-pencil"></i> Edit</span>' +
			'</div>' +
		'</div>';
	},

	_getSourceEditHtml = function (src) {
		src = src || {};
		return '<div class="entry in-edit ' + (src.id ? '' : 'new-item') + '" data-id="' + (src.id || '') + '"><form>' +
			'<div class="entry-header">' +
				'<span class="entry-source"><input name="url" value="' + (src.url || '') + '" placeholder="url"></span>' +
				'<h3>' +
					'<input name="name" value="' + (src.name || '') + '" placeholder="name">' +
					'<input name="tag" value="' + (src.tag || '') + '" placeholder="tag">' +
				'</h3>' +
			'</div>' +
			'<div class="entry-footer">' +
				'<span class="pull-right entry-time">added: ' + (src.created_at || '') + '</span>' +
				'<span class="tb-btn btn-save"   data-action="save"><i class="icon-save"></i> Save</span>' +
				'<span class="tb-btn btn-cancel" data-action="cancel"><i class="icon-remove"></i> Cancel</span>' +
			'</div>' +
		'</form></div>';
	},

	_populate = function (data) {
		if (!data || !data.length) return;
		_items = data;
		var i = 0, item, html = [];
		for (; item = _items[i++] ;) html.push(_getSourceHtml(item));
		_container.html(html.join(''));
	},
	/*** HTML *********************************************************************************************************/







	_load = function () { App.Get('sources', _populate); },

	_updateAllFeeds = function (btn) {
		_showUpdateLoading(btn, true);
		if (_updateRequest) return _updateRequest.abort();
		_updateRequest = App.Get('update', function (resp) {
			_showUpdateLoading(btn);
			var msg = 'Update error!';
			if (resp.result === 'success') {
				msg = resp.feeds + ' feeds updated\n' +
					resp.items + ' new items found\n' +
					resp.removed + ' old items removed';
			}
			window.alert(msg);
		}, 20000).always(function () {
			_updateRequest = null;
			_showUpdateLoading(btn);
		});
	},



	_init = function () {
		if (_isReady) return;
		_container = $('body.settings .main-wrapper');
		_sidebar = $('body.settings #sidebar');
		if (!_container.length) return;

		_container.on('click', '.tb-btn', _btnClickHandler);
		_container.on('dblclick', '.entry', _entryDoubleClick);
		_sidebar.on('click', '.btn', _btnClickHandler);

		$(document).on('keydown', _onKeyUp);

		_load();
		_isReady = true;
	};

	App.Subscribe('source/add', _addSource);
	App.Subscribe('app/ready', _init);

}(jQuery, window.App, this));
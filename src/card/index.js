import $ from 'util';

var eventsReady = false;

/**
 * Add correct classes (starred | unread) to a card
 * @param  {string} action action name - from data-action attr. of an icon
 * @param  {object} card   dom
 */
function cardAction (action, card) {
	let [mark, cls] = action.split('-');
	let add = { mark: 'add', unmark: 'remove' }[mark];
	card[add + 'Class'](cls);
	$.trigger('card/action', action, card);
}

function mainEventHandler (e) {
	let el = $(e.target);
	let card = el.closest('.card');
	if (!card || !card.length) return;
	let btn = el.closest('.card-footer .icon');

	if (btn) {
		e.preventDefault();
		let action = btn.data('action');
		cardAction(action, card);
	}
}

function initEvents () {
	if (eventsReady) return;
	$('.main').on('click', mainEventHandler);
	eventsReady = true;
}



function getCardHtml (row) {
	initEvents();
	let cls = [ 'card' ];
	if (row.is_starred) cls.push('starred');
	if (row.is_unread) cls.push('unread');

	return `<div class="${cls.join(' ')}" data-id="${row.id}">
			<div class="card-header">
				<span class="card-date">${row.published_at}</span>
				<h2 class="card-title"><a href="#">${row.title}</a></h2>
				<h3 class="card-subtitle">from <a href="#">source name ${row.source_id}</a></h3>
			</div>
			<div class="card-body">${row.content}</div>
			<div class="card-footer">
				<a href="#" data-action="mark-expanded" class="btn-expand icon ion-ios-more icon-right" title="Expand"></a>
				<a href="#" data-action="unmark-expanded" class="btn-collapse icon ion-ios-close-empty icon-right" title="Collapse"></a>

				<a href="#" data-action="mark-unread" class="btn-mark-unread icon ion-ios-checkmark-outline" title="Mark as unread"></a>
				<a href="#" data-action="unmark-unread" class="btn-mark-read icon ion-ios-circle-filled" title="Mark as read"></a>

				<a href="#" data-action="mark-starred" class="btn-mark-starred icon ion-ios-star-outline" title="Star"></a>
				<a href="#" data-action="unmark-starred" class="btn-mark-unstarred icon ion-ios-star" title="Unstar"></a>
			</div>
		</div>`;
}


function card (data) {
	if ($.type(data) === 'array') {
		return data.map(getCardHtml).join('');
	}
	return getCardHtml(data);
}


export default { cardAction, card };

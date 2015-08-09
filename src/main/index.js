import $ from 'util';
import Data from 'data/articles';
import Card from 'card';

var main, el, activeArticle, filler, isReady = false;



/*** HELPERS **************************************************************************************/
function updateHeight () {
	if (!main ||  !main.length) return;
	var mainH = main[0].getBoundingClientRect().height;
	filler[0].style.height = mainH + 'px';
}

function scrollTo (card) {
	card = card || activeArticle || null;
	if (!card) return;
	main[0].scrollTop = card[0].offsetTop - card.style('marginTop') + 2;
	activeArticle.removeClass('active');
	activeArticle = card.addClass('active');
}

function scrollToPrev  () {
	var prev = activeArticle.prev('.card');
	if (prev) scrollTo(prev);
}

function scrollToNext  () {
	var next = activeArticle.next('.card');
	if (next) {
		markAsRead(activeArticle);
		scrollTo(next);
	}
}

function markAsRead (article) {
	setTimeout(function () { Card.cardAction('unmark-unread', article); }, 300);
}
/*** HELPERS **************************************************************************************/




function load (hash) {
	// console.log('loading', hash);

	Data.getUnread().then(data => {
		el.html(Card.card(data));
		activeArticle = el.find('.card').first().addClass('active');
		scrollTo();
		$.trigger('data/changed', data);
	});
}



function cardAction (action, card) {
	var id = card.data('id');
	if (!id) return;
	if (action === 'unmark-unread') console.log('mark as read', id);
}



function init () {
	if (!isReady) {
		main = $('.home .main');
		if (!main) return;

		el = main.find('.articles');
		filler = main.find('.article-fill');

		$.on('resizeend', updateHeight);
		$.on('nav/prev', scrollToPrev);
		$.on('nav/next', scrollToNext);
		$.on('card/action', cardAction);
		$.on('data/reload', load);
		$.on('nav/changed', load);
	}

	updateHeight();
	// load();
	isReady = true;
}


export default {
	init
};

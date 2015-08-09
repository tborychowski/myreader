import $ from 'util';
import Data from 'data/articles';
import Card from 'card';
import Hash from 'hash';

var main, el, activeArticle, currentSection, filler, isReady = false;



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

function openArticle () {
	var l = activeArticle.find('.card-title>a');
	if (l && l.length) l[0].click();
}

function markAsRead (article) {
	setTimeout(function () { Card.cardAction('unmark-unread', article); }, 300);
}

function onKeyUp (e) {
	if (e.letter === 'P') $.trigger('nav/prev');
	else if (e.letter === 'N') $.trigger('nav/next');
	else if (e.letter === 'R') $.trigger('data/reload');
	else if (e.key === 13) $.trigger('nav/open');
}
/*** HELPERS **************************************************************************************/




function load () {
	if (currentSection === Hash.section) return;
	Data
		.get({ section: Hash.section })
		.then(data => {
			el.html(Card.card(data.items));

			let cards = el.find('.card');
			if (cards && cards.length) activeArticle = cards.first().addClass('active');
			scrollTo();
			currentSection = Hash.section;
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

		el = main.find('.home .articles');
		if (!el || !el.length) return;
		filler = main.find('.article-fill');

		$.on('resizeend', updateHeight);
		$.on('keyup', onKeyUp);

		$.on('nav/prev', scrollToPrev);
		$.on('nav/next', scrollToNext);
		$.on('nav/open', openArticle);
		$.on('nav/changed', load);

		$.on('card/action', cardAction);
		$.on('data/reload', load);
	}

	updateHeight();
	// load();
	isReady = true;
}


export default {
	init
};

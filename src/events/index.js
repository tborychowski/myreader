import $ from 'util';

var isReady = false, resizeTimeout = null;


/*** HELPERS **************************************************************************************/
function keyEvent (e) {
	var chr = String.fromCharCode(e.keyCode);
	return {
		event: e,
		letter: chr,
		key: e.keyCode,
		shift: e.shiftKey,
		ctrl: e.ctrlKey,
		alt: e.altKey
	};
}


function onResize () {
	if (resizeTimeout) clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(onResizeEnd, 300);
}
/*** HELPERS **************************************************************************************/





/*** PUBLISHABLE **********************************************************************************/
function onResizeEnd () { $.trigger('resizeend'); }
function onKeyUp (e) { $.trigger('keyup', keyEvent(e)); }
function onKeyDown (e) { $.trigger('keydown', keyEvent(e)); }

/*** PUBLISHABLE **********************************************************************************/





function init () {
	if (!isReady) {
		window.addEventListener('resize', onResize);
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('keydown', onKeyDown);
	}

	isReady = true;
}


export default {
	init
};

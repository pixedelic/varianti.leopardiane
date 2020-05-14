(function($) {
	"use strict";
	var LEOVAR = window.LEOVAR || {};
	window.LEOVAR = LEOVAR;

	window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame	   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame	||
			window.oRequestAnimationFrame	  ||
			window.msRequestAnimationFrame	 ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	window.requestTimeout = function(fn, delay) {
		if( !window.requestAnimationFrame	  	&&
			!window.webkitRequestAnimationFrame &&
			!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
			!window.oRequestAnimationFrame	  &&
			!window.msRequestAnimationFrame)
				return window.setTimeout(fn, delay);

		var start = new Date().getTime(),
			handle = new Object();

		function loop(){
			var current = new Date().getTime(),
				delta = current - start;

			delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
		};

		handle.value = requestAnimFrame(loop);
		return handle;
	};

	window.clearRequestTimeout = function(handle) {
		if ( typeof handle !== 'undefined' ) {
			window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
			window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
			window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
			window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
			window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
			window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
			clearTimeout(handle);
		}
	};

	LEOVAR.menu = function(){
		var $header = $( 'header' ),
			$nav = $( 'nav', $header ),
			navW, off;
		
		$( 'li:has(ul)', $nav ).on( 'mouseover', function(){
			navW = $nav.outerWidth();
			off = $nav.offset();

			var $ulUl = $( '> ul', this ).css({ 'margin-left' : 0 }),
				offUl = $ulUl.offset(),
				ulW = $ulUl.outerWidth();

			if ( (offUl.left + ulW) > (off.left + navW) ) {
				$ulUl.css({ 'margin-left' : -1 * ( (offUl.left + ulW) - (off.left + navW) ) });
			}
		});
	}

	LEOVAR.init = function() {
		$( document ).ready( function(){
			$( 'html' ).addClass( 'dom-loaded' );
			LEOVAR.menu();
		});

	}

	LEOVAR.init();

})(jQuery);

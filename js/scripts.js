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
			$parent = $nav.closest(' .limit-width' ),
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
	};

	LEOVAR.timeLine = function(){
		var $timeline = $('#timeline-box'),
			$desc = $('.description', $timeline),
			$boxes = $('.box-edizione', $timeline),
			$targets = $('[data-time]', $timeline),
			$triggers = $('[data-time-trigger]', $timeline);

		var initTimeLine = function(){
			$boxes.each(function(i, el){
				$(el).css({
					'margin-left': 0,
					'margin-right': 0
				});
				var off = $(el).offset(),
					elW = $(el).outerWidth(),
					descR = $desc.outerWidth() + $desc.offset().left,
					tLr = $timeline.outerWidth() + $timeline.offset().left;
				if ( off.left < ( descR + 15 ) ) {
					$(el).css({
						'margin-left': descR - off.left
					});
				} else if ( ( off.left + elW ) > tLr ) {
					$(el).css({
						'margin-right': ( ( off.left + elW ) - tLr )
					});
				}
			});
		};
		initTimeLine();
		var setTimeLine;
		function initSetTimeLine() {
			clearRequestTimeout(setTimeLine);
			setTimeLine = requestTimeout(function(){
				initTimeLine();
			}, 100);
		}
		window.addEventListener('resize', initSetTimeLine);

		$('.timeline-point > a', $timeline).on('click', function(e){
			e.preventDefault();
			$targets.removeClass('active');
			var $target = $(e.target).closest('[data-time]').addClass('active'),
				dataTime = $target.attr('data-time'),
				$trigger = $('[data-time-trigger="' + dataTime + '"]', $timeline);
			$triggers.not($trigger).fadeOut(500);
			$trigger.fadeIn(500);
			initTimeLine();
		});
	};

	LEOVAR.scroll = function(){
		$('.onscroll-elem').each(function(ind, el){
			var waypoint = new Waypoint({
				element: el,
				handler: function(direction) {
					$(el).addClass('in-view');
				},
				offset: '50%' 
			})
		});
	}

	LEOVAR.init = function() {
		$( document ).ready( function(){
			$( 'html' ).addClass( 'dom-loaded' );
			LEOVAR.menu();
			LEOVAR.scroll();
			LEOVAR.timeLine();
		});

	}

	LEOVAR.init();

})(jQuery);

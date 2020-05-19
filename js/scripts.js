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

	LEOVAR.utils = function(){
		$('a[href="#"]').on('click', function(e){
			e.preventDefault();
		});
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
				offset: '70%' 
			})
		});
	};

	LEOVAR.parax = function(){
		$('.parax').each(function(){
			var $this = $(this),
				bg = $this.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
			$this.css({
				'background-image':'none',
				'background-color':'transparent'
			}).parallax({
				imageSrc: bg,
				speed: 0.75
			});
		});
	};

	LEOVAR.poem = function(){
		var style = '';
		$('.poem').each(function(){
			var $poem = $(this),
				$lines = $('.verse', $poem),
				$verses = $('.verse[data-verse][data-show-verse="true"]', $poem),
				$vars = $('span[data-vars]', $poem);

			$verses.each(function(i, verse){
				var num = $(verse).attr('data-verse'),
					num_0 = num,
					fontStyle = '';
				if ( num_0.indexOf('@') !== -1 ) {
					num_0 = num_0.split('@');
					num_0 = num_0[0];
					fontStyle = 'font-style:italic;'
				}

				style = style + '.verse[data-verse="' + num + '"]::before{content:"' + num_0 + '";' + fontStyle +'}';
			});

			$vars.each(function(){
				var $cont = $(this),
					$dataVars = $('> span[data-var]', $cont),
					dataString = '',
					badges = '';
				$dataVars.each(function(i, dV){
					var $dv = $(dV),
						dataVar = $dv.attr('data-var'),
						dataArr = dataVar.split(','),
						di;

					for (di = 0; di < dataArr.length; di++) {
						dataString = dataString + dataArr[di] + ' ';
						badges = badges + '<span data-var-badge="' + dataArr[di] + '"></span>';
					}
				});	
				$cont.prepend('<span class="variant-alert" data-badges="' + dataString + '">' + badges + '</span>');	

				$('span[data-var-badge]', $cont).on('click', function(e){
					//e.stopPropagation();
					var $badge = $(this),
						badge = $badge.attr('data-var-badge');
					$('#filtri a[data-trigger="' + badge + '"').click();
				});

				$dataVars.on('click',function(){
					$lines.removeClass('active');
					var $verse = $('.verse', $cont).length ? $('.verse', $cont) : $cont.closest('.verse'),
						versePos = $verse.position(),
						dataVerse = $verse.attr('data-verse'),
						$dataVars = $('> span[data-var]', $cont),
						off = $cont.position(),
						$aside = $cont.closest('.container').find('aside'),
						colW = $aside.outerWidth(),
						out = '',

						$dv = $(this),
						dataVar = $dv.attr('data-var'),
						dataArr = dataVar.split(','),
						text = $dv.html(),
						badge = '',
						di;

					$verse.addClass('active');

					$('.show-vars').remove();

					$dataVars.each(function(i, dV){
						var $dv = $(dV),
							dataVar = $dv.attr('data-var'),
							dataArr = dataVar.split(','),
							text = $dv.html(),
							badge = '',
							di;

						if ( $('span[data-var]', $dv).length ) {
							text = $('span[data-var]', $dv).html();
						}
						if ( typeof $dv.attr('data-content') !== 'undefined' && $dv.attr('data-content') !== '' ) {
							text += ' ' + $dv.attr('data-content');
						}
						for (di = 0; di < dataArr.length; di++) {
							badge += '<span data-var-badge="' + dataArr[di] + '"></span>';
						}
						out += '<span data-show-var="' + dataVar + '"><span class="var-title">' + badge + dataVar.replace(/,/g, ", ") + '</span><span class="var-text">' + text + '</span></span>';
					});

					var verseAbbr = '';
					if ( dataVerse.indexOf('@') === -1 ) {
						verseAbbr = 'v. ';
					}

					var offTop = off.top;
					if ( versePos.top < 0 ) {
						offTop = offTop + versePos.top;
					}

					$dv.closest('.stanza').append('<span class="show-vars" style="top:' + offTop + 'px; width:' + colW + 'px"><span class="verse-var"><span>' + verseAbbr + dataVerse + '</span></span>' + out + '<span class="close-vars"></span></span>');

					$('.close-vars').on('click', function(){
						var $span = $(this).closest('.show-vars').remove();
						$('.poem .verse').removeClass('active');	
					});

					$(window).trigger('resize');
				});
			});
		});
		$('body').append('<style>' + style + '</style>');

		$('#filtri a').on('click', function(){
			var $a = $(this),
				ediz = $a.attr('data-trigger');

			$('.show-vars').remove();
			$('.poem .verse').removeClass('active');

			$a.closest('#filtri').find('li').removeClass('active');
			$a.closest('li').addClass('active');
			$a.closest('section[data-active-var]').attr('data-active-var',ediz);

			$(window).trigger('resize');
		});
	};

	LEOVAR.init = function() {
		$( document ).ready( function(){
			$( 'html' ).addClass( 'dom-loaded' );
			LEOVAR.utils();
			LEOVAR.menu();
			requestTimeout(function(){
				LEOVAR.scroll();
			}, 500);
			LEOVAR.timeLine();
			LEOVAR.parax();
			LEOVAR.poem();
		});
	}

	LEOVAR.init();

})(jQuery);

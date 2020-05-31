(function($) {
	"use strict";
	var VARLEO = window.VARLEO || {};
	window.VARLEO = VARLEO;

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

	VARLEO.utils = function(){
		$('a[href="#"]').on('click', function(e){
			e.preventDefault();
		});
	};

	VARLEO.menu = function(){
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

	VARLEO.timeLine = function(){
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

	VARLEO.scroll = function(){
		$('.onscroll-elem').each(function(ind, el){
			var waypoint = new Waypoint({
				element: el,
				handler: function(direction) {
					$(el).addClass('in-view');
				},
				offset: '70%' 
			})
		});

		var filtriDim = function(){
			var $filtri = $('#filtri'),
				$filtriBack = $('#filtri-backplace'),
				$ul = $('> ul', $filtri),
				$filtriPH = $('#filtri-placeholder'),
				off = $filtri.offset(),
				filtriH = $ul.outerHeight(),
				filtriW = $filtri.width();

			if ( $filtri.length ) {

				$filtriPH.css({
					'left': off.left,
					'width': filtriW
				});

				$filtriBack.css({
					'height': filtriH,
					'width': filtriW
				});

			}
		};

		var setTimeLine;
		function initSet() {
			clearRequestTimeout(initSet);
			initSet = requestTimeout(function(){
				filtriDim();
			}, 100);
		}
		window.addEventListener('resize', initSet);	
		filtriDim();	

		$('#filtri').each(function(ind, el){
			var $filtri = $(el),
				$ul = $('> ul', $filtri),
				$filtriBack = $('#filtri-backplace'),
				$filtriPH = $('#filtri-placeholder');
			var waypoint = new Waypoint({
				element: el,
				handler: function(direction) {
					if ( direction === 'down' ) {
						$ul.appendTo($filtriPH);
						$filtriPH.add($filtriBack).show();
					} else {
						$ul.appendTo($filtri);
						$filtriPH.add($filtriBack).hide();
					}
				},
				offset: 0
			})
		});
	};

	VARLEO.parax = function(){
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

	VARLEO.poem = function(){
		var style = '';
		$('.poem').each(function(){
			var $poem = $(this),
				$lines = $('.line', $poem),
				$verses = $('.line[data-step][data-show-step="true"]', $poem),
				$vars = $('span[data-vars]', $poem);

			$verses.each(function(i, verse){
				var num = $(verse).attr('data-step'),
					num_0 = num;

				style = style + '.line[data-step="' + num + '"]::before{content:"' + num_0 + '";}';
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
					$('.filtri a[data-trigger="' + badge + '"').click();
				});

				$dataVars.on('click',function(){
					$lines.removeClass('active');
					var $verse = $('.line', $cont).length ? $('.line', $cont) : $cont.closest('.line'),
						versePos = $verse.position(),
						dataVerse = $verse.attr('data-step'),
						$dataVars = $('> span[data-var]', $cont),
						off = $cont.position(),
						$aside = $cont.closest('.container').find('aside'),
						colW = $aside.outerWidth(),
						out = '',

						$dv = $(this),
						$stanza = $dv.closest('.stanza'),
						dataVar = $dv.attr('data-var'),
						dataArr = dataVar.split(','),
						text = $dv.html(),
						badge = '',
						di;

					if ( ! $stanza.length ) {
						$stanza = $verse;
					}

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

					var $showVars = $('<span class="show-vars" />');
					$showVars.append('<span class="line-var"><span>' + verseAbbr + dataVerse + '</span></span>' + out + '<span class="close-vars"></span>');
					$showVars.css({ 
						'top': offTop,
						'width': colW
					});

					$stanza.append($showVars);

					var varsH = $showVars.height(),
						stanzaT = $stanza.position().top,
						poemH = $poem.outerHeight(),
						diff = ( stanzaT + offTop + varsH + 100 ) - poemH;

					if ( diff > 0 ) {
						$showVars.css({ 
							'margin-top':diff * -1
						});
					}


					$('.close-vars').on('click', function(){
						var $span = $(this).closest('.show-vars').remove();
						$('.poem .line').removeClass('active');	
					});

					$(window).trigger('resize');
				});
			});
		});
		$('body').append('<style>' + style + '</style>');

		$('.filtri a').on('click', function(){
			var $a = $(this),
				ediz = $a.attr('data-trigger');

			$('.show-vars').remove();
			$('.poem .line').removeClass('active');

			$a.closest('.filtri').find('li').removeClass('active');
			$a.closest('li').addClass('active');
			$a.closest('section[data-active-var]').attr('data-active-var',ediz);

			$(window).trigger('resize');
		});
	};

	VARLEO.sticky = function(){
		$('.sticky').each(function(i, el){
			var offset_top = $(el).attr('data-offset');
			if ( typeof offset_top === 'undefined' || offset_top === '' ) {
				offset_top = 67;
			}
			var $sticky = $(el).stick_in_parent({
				offset_top: parseFloat( offset_top )
			});

			$(window).on('resize', function(){
				$(document.body).trigger("sticky_kit:recalc");
			});
		});
	};

	VARLEO.gallery = function(){
		$('[data-fancybox]').fancybox({
			animationEffect: "fade",
			transitionEffect: "slide",
		});
	};

	VARLEO.tabs = function(){
		$('.nav.nav-tabs').each(function(){
			var $nav = $(this),
				$tabs = $('.nav-item', $nav),
				$content = $(' + .tab-content', $nav),
				$panels = $('.tab-pane', $content);

			$tabs.on('click', $tabs, function(){
				var $tab = $(this),
					$target = $tab.attr('data-target-panel'),
					$panel = $panels.filter('[data-panel="' + $target + '"]');

				$tabs.add($panels).removeClass('active');
				$tab.add($panel).addClass('active');

				$(window).trigger('resize');
			});
		})
	};

	VARLEO.collapse = function(){
		$('a.collapse').on('click', function(){
			var $a = $(this),
				$parent = $a.parent(),
				$toggle = $(' + .collapsible', $a);
			if ( !$toggle.length ) {
				$toggle = $(' + .collapsible', $parent);
			}
			$a.add($toggle).toggleClass('active');
			$toggle.slideToggle(400, 'easeOutExpo', function(){
				$(window).trigger('resize');
			});
		});
	};

	VARLEO.sortTable = function(){
		var $table = $('#list-canti'),
			$thead = $('thead', $table),
			$ths = $('th', $thead),
			$tbody = $('tbody', $table),
			$trs = $('tr', $tbody),
			$legenda = $('#legenda'),
			$gruppi = $('#gruppi'),
			$luoghi = $('#luoghi');

		$trs.each(function(){
			var $tr = $(this),
				$badges = $('span[data-var-badge]', $tr),
				place = $('td:nth-child(4)', $tr).text().toLowerCase().replace(/\s\s+/g, ' '),
				$tds = $('td', $tr),
				dataEd = new Array;

			$badges.each(function(i,el){
				dataEd.push( $(el).attr('data-var-badge') )
			});

			$tds.each(function(){
				$(this).wrapInner('<span />');
			});

			$tr.attr('data-edizione', dataEd.toString()).attr('data-place',place);
		});

		$table.tablesorter({
			headerTemplate: '',
			sortInitialOrder: 'desc',
			selectorSort: 'th.col-sort'
		});

		$ths.on('click', function(){
			var $th = $(this);
			$ths.removeClass('active');
			$th.addClass('active');
		});

		$('span[data-var-badge]', $table).on('click', function(){
			var $badge = $(this),
				$ed = $badge.attr('data-var-badge');

			$table.attr('data-visible-tr', $ed);
		});

		$('a[data-var-badge]', $legenda).on('click', function(){
			var $badge = $(this),
				$ed = $badge.attr('data-var-badge');

			$('.aside-box ul li a:first-child').removeClass('fade');
			if ( $ed !== '1845' ) {
				$('a[data-var-badge]', $legenda).addClass('fade');
				$badge.removeClass('fade');
			}

			$table.attr('data-visible-tr', $ed);
		});

		$('a[data-var-group]', $gruppi).on('click', function(){
			var $group = $(this),
				$ed = $group.attr('data-var-group');

			$('.aside-box ul li a:first-child').removeClass('fade');
			if ( $ed !== '1845' ) {
				$('a[data-var-group]', $gruppi).addClass('fade');
				$group.removeClass('fade');
			}

			$table.attr('data-visible-tr', $ed);
		});

		$('a[data-var-place]', $luoghi).on('click', function(){
			var $place = $(this),
				$ed = $place.attr('data-var-place');

			$('.aside-box ul li a:first-child').removeClass('fade');
			if ( $ed !== '1845' ) {
				$('a[data-var-place]', $luoghi).addClass('fade');
				$place.removeClass('fade');
			}

			$table.attr('data-visible-tr', $ed);
		});
	};

	VARLEO.smoothScroll = function(){

		if ( window.location.hash ) scroll(0,0);

		$('a[href*="#"]').on('click', function(e) {
			var href = $(this).attr('href'),
				$href;
			if ( href !== '#' ) {
				href = href.split('#');
				$href = $('#' + href[1]);
				if ( $href.length && typeof $href.offset() !== 'undefined' ) {
					$('html, body').animate({
						scrollTop: $href.offset().top + 'px'
					}, 1000, 'easeOutExpo');
				}
			}
		});

		if(window.location.hash) {
			var $hash = $(window.location.hash);
			if ( $hash.length && typeof $hash.offset() !== 'undefined' ) {
				$('html, body').animate({
					scrollTop: $hash.offset().top + 'px'
				}, 1000, 'easeOutExpo');
			}
		}
	};

	VARLEO.textCloud = function(){
		var $iframes = $('iframe');

		$iframes.each(function(){
			var $iframe = $(this),
				w = parseFloat($iframes.attr('width')),
				h = parseFloat($iframe.attr('height')),
				ratio, frW;

			ratio = h / w;
			var resizeiFrame = function(){
				frW = $iframe.width();
				$iframe.css({
					height: frW * ratio
				});
			};
			resizeiFrame();
			$(window).on('resize load', resizeiFrame);

		});
	};

	VARLEO.init = function() {
		$( document ).ready( function(){
			$( 'html' ).addClass( 'dom-loaded' );
			VARLEO.utils();
			VARLEO.menu();
			requestTimeout(function(){
				VARLEO.scroll();
			}, 500);
			VARLEO.timeLine();
			VARLEO.parax();
			VARLEO.poem();
			VARLEO.sticky();
			VARLEO.gallery();
			VARLEO.tabs();
			VARLEO.collapse();
			VARLEO.sortTable();
			VARLEO.smoothScroll();
			VARLEO.textCloud();
		});
	}

	VARLEO.init();

})(jQuery);

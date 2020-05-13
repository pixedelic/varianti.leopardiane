(function($) {
	"use strict";
	var LEOVAR = window.LEOVAR || {};
	window.LEOVAR = LEOVAR;

	LEOVAR.init = function() {
		$( document ).ready( function(){
			$( 'html' ).addClass( 'dom-loaded' );
		});
	}

	LEOVAR.init();

})(jQuery);

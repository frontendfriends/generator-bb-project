/**
 * @file Settings
 * @version 0.6.2
 * @author {@link https://github.com/buildingblocks Building Blocks}
 * Generated <%= currentDateTime %>
 */
var bb = bb ? bb : {};
(function ($) {
	$.extend(bb, {
		settings: {
			// cache some common variables
			$window: $(window),
			$html: $('html'),
			$body: $('body'),
			$htmlbody: $('html,body'),
			$page: $('#page'),
			$header: $('#header'),
			$main: $('#main'),
			$footer: $('#footer'),
			// stored URL params (empty to begin with)
			urlParams: {},
			// class to use on
			processedClass: 'processed',
			browserPrefix: null,
			transitionEnd: null,
			animationEnd: null,
			transitionAnimationEnd: null,
			// store processing of last component globally
			processinglastBlock: false,
			// breakpoint variables (should match variables.less)
			breakPointA: 320,
			breakPointB: 480,
			breakPointC: 600,
			breakPointD: 768,
			breakPointE: 1000,
			breakPointF: 1200,
			breakPointG: 1360,
			// store scripts directory
			scriptsDirectory: '',
			// is this a RTL site?
			rtl: false
		}
	});
}(jQuery));

define([

], function() {
	return function() {

		setTimeout(function() {
			$(document).ready(function() {
				hideAddressbar();
				$(document).on('touchmove', function(e) {
					// preventing overscroll on ios
					if (document.documentElement.clientHeight !== window.innerHeight) {
						e.preventDefault();
					}
				});
			});
			//don't need the timeout for release since jquery loads with require.js
		}, (env === "dev") ? 300 : 0);

		window.runAddressBarCheck = function(activeHeight) {
			var ua = navigator.userAgent,
			iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod');
			if (!iphone) return;
			setTimeout(function() {
				if (activeHeight != window.innerHeight) {
					setTimeout(function() {
						scrollTo(0, 0);
						runAddressBarCheck(window.innerHeight);
					}, 2000);
				} else {
					runAddressBarCheck(activeHeight);
				}
			}, 500);
		};

		window.hideAddressbar = function() {
			var page = document.getElementsByTagName('body')[0],
				ua = navigator.userAgent,
				iphone = ~ua.indexOf('iPhone') || ~ua.indexOf('iPod'),
				// Detect if this is running as a fullscreen app from the homescreen
				fullscreen = window.navigator.standalone,
				lastWidth = 0;
			// Start out by adding the height of the location bar to the width, so that
			// we can scroll past it

			// iOS reliably returns the innerWindow size for documentElement.clientHeight
			// but window.innerHeight is sometimes the wrong value after rotating
			// the orientation
			var height = document.documentElement.clientHeight;

			// Only add extra padding to the height on iphone / ipod, since the ipad
			// browser doesn't scroll off the location bar.

			page.style.height = height + 'px';

			setTimeout(scrollTo, 0, 0, 1);

			(window.onresize = function() {
				var height = document.documentElement.clientHeight;
				if (iphone && !fullscreen && parseInt($.browser.version, 10) <= 536 ) height += 60;
				page.style.height = height + 'px';

				var pageWidth = page.offsetWidth;
				// Android doesn't support orientation change, so check for when the width
				// changes to figure out when the orientation changes
				if (lastWidth == pageWidth) return;
				lastWidth = pageWidth;
			})();

			runAddressBarCheck(window.innerHeight);
		};
	};
});
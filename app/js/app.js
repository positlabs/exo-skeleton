define(function (require, exports, module) {
	require("backbone");
	require("underscore");
	require("jquery");

	// External dependencies.
	var constants = require('../data/constants');
	var Webapp = require('Webapp');

//	var Tracking = require("services/Tracking");
//
//	Tracking.init();

	// Provide a global location to place configuration settings and module
	// creation.

	return function () {

		window.$window = $(window);
		window.$body = $(document.body);
		window.$html = $('html');

		var app = _.extend({}, Backbone.Events);
		window.app = app;

		app.root = "";
		app.dataRoot = "data/";
		app.constants = constants;

		//--------------------------------------------------------------------------------
		// Screen dimension Calculations
		//--------------------------------------------------------------------------------

		app.getMediaSize = function (dimensions) {
			var width = dimensions.width;
			if (width < 500) {
				return 360;
			} else if (width < 711) {
				return 640;
			} else if (width < 1066) {
				return 854;
			} else if (width < 1682) {
				return 1280;
			} else {
				return 1920;
			}
		};

		app.getOrientation = function () {
			return Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
		};
		app.getMobileWidth = function () {
			return app.getOrientation() == "landscape" ? screen.availHeight : screen.availWidth;
		};
		app.getMobileHeight = function () {
			return app.getOrientation() == "landscape" ? screen.availWidth : screen.availHeight;
		};

		//--------------------------------------------------------------------------------
		// Event handlers
		//--------------------------------------------------------------------------------

		app.onResize = function () {
			app.trigger('resize');
		};

		var $window = $(window);
		$window.on('resize', _.debounce(app.onResize, 500));

		//resize on window focus because in safari if a video starts when the window is not focused, it will not size correctly.
		$window.focus(function () {
			app.onResize();
		});

		$window.on("orientationchange", function (e) {
			app.orientationChanged = true;
			app.onResize();
		});

		var Main = Backbone.View.extend({
			el: "#main",
			template: "main",
			events: {
			},
			afterRender: function() {
				Webapp();
				setTimeout(function(){
					app.onResize();
				}, 1000);
			}
		});
		app.main = new Main();

		return app;
	}
});
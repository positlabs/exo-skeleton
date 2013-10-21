define(function (require, exports, module) {

	// External dependencies.
	var constants = require('../data/constants');
	var Webapp = require('Webapp');
	var Tracking = require("services/Tracking");
	var Router = require("router");

	var Backbone = require("backbone");
	var Layout = require("backbone.layoutmanager");

	var MainView = require("views/Main");


	Tracking.init();

	// Provide a global location to place configuration settings and module
	// creation.

	window.$window = $(window);
	window.$body = $(document.body);
	window.$html = $('html');

	var app = _.extend({}, Backbone.Events);
	window.app = app;

	app.root = "/";
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

	$window.on('resize', _.debounce(app.onResize, 500));

	//resize on window focus because in safari if a video starts when the window is not focused, it will not size correctly.
	$window.focus(function () {
		app.onResize();
	});

	$window.on("orientationchange", function (e) {
		app.orientationChanged = true;
		app.onResize();
	});

	app.initialize = function () {
		app.onResize();

		// Define your master router on the application namespace and trigger all
		// navigation from this instance.
		app.router = new Router();

		app.main = new MainView();
		app.main.once('afterRender', function(){
			Backbone.history.start({
				root: app.root
			});
		});
		app.main.render();


	};

	return app;
});
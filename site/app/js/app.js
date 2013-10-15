define(function(require, exports, module) {

	// External dependencies.
	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");
	var constants = require('data/constants');
	var Webapp = require('Webapp');

	// Provide a global location to place configuration settings and module
	// creation.

	window.$window = $(window);
	window.$body = $(document.body);
	window.$html = $('html');

	var app = _.extend({}, Backbone.Events);

	app.root = "";
	app.dataRoot = "app/data/";
	app.audioRoot = "app/assets/sounds/";
	app.videoRoot = "app/assets/videos/";
	app.imageRoot = "app/assets/img/";
	app.shareRoot = "http://tbwa-gen-stg-app01.reliam.com/passiongenome/";
	app.apiRoot = "api/";
	if (env === 'dev'){
		app.apiRoot = "http://dev-nissan.toolprototype.com/api/";
	}
	app.constants = constants;

	//--------------------------------------------------------------------------------
	// localization
	//--------------------------------------------------------------------------------

	// if lang is in languages array use language, else use english
	var lang = $("html").attr('lang');
	app.lang = (app.constants.languages.indexOf(lang) > -1) ? lang : "en";

	//--------------------------------------------------------------------------------
	// Screen dimension Calculations
	//--------------------------------------------------------------------------------

	app.getMediaSize = function(dimensions){
		var width = dimensions.width;
		if (width < 500) {
			return 360;
		} else if (width < 711) {
			return 640;
		} else if (width < 1066) {
			return 854;
		} else if (width < 1682) {
			return 1280;
		} else { //1920
			return 1920;
		}
	};

	app.getOrientation = function(){
		return Math.abs(window.orientation) - 90 == 0 ? "landscape" : "portrait";
	};
	app.getMobileWidth = function(){
		return app.getOrientation() == "landscape" ? screen.availHeight : screen.availWidth;
	};
	app.getMobileHeight = function(){
		return app.getOrientation() == "landscape" ? screen.availWidth : screen.availHeight;
	};

	//--------------------------------------------------------------------------------
	// Event handlers
	//--------------------------------------------------------------------------------


	app.onResize = function() {
		app.dimensions = app.getDimensions();
		app.trigger('resize');
	};

	var $window = $(window);
	$window.on('resize', _.debounce(app.onResize, 500));
	
	//resize on window focus because in safari if a video starts when the window is not focused, it will not size correctly.
	$window.focus(function(){
		app.onResize();
	});

	$window.on("orientationchange", function(e){
		app.orientationChanged = true;
		app.onResize();
	});


	//--------------------------------------------------------------------------------
	// Boilerplate
	//--------------------------------------------------------------------------------

	// The application user interface handles link hijacking and can be modified
	// to handle other application global actions as well.

	app.ui = new Backbone.View({
		el: "#main",
		template: "MainLayout",
		events: {
		},
		afterRender: function() {
			Webapp();
			setTimeout(function(){
				app.onResize();
			}, 1000);
		}
	});

	return app;
});
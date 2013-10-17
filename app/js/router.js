define(function (require, exports, module) {

	require('modernizr');

	var Backbone = require("backbone");
	var app = require('app');
	var Tracking = require('services/Tracking');
	var Index = require('views/Index');

	return function () {

		// Defining the application router, you can attach sub routers here.
		var Router = Backbone.Router.extend({
			init: function () {
				app.ui.setViews({
					"body": new Index()
				}).render();
			},
			routes: {
				"": "index",
				'*path': 'index'
//			"(/:id)": "portrait",
			},

			index: function () {
//			Tracking.trackPageview("landing");
			}

		});

		return Router;
	}

}); 

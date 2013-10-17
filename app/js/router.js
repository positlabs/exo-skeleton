define(function (require, exports, module) {

	require('modernizr');
	require("backbone");

	var app = require('app');
	var Tracking = require('services/Tracking');
	var Index = require('views/Index');

	// Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		initialize:function(){
			this.on("route", this.onRoute);
		},
		routes: {
			"": "index",
			'*path': 'index'
//			"(/:id)": "portrait",
		},
		index: function () {
			console.log("index");

//			Tracking.trackPageview("landing");
		}

	});

	return Router;

}); 

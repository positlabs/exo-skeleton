define(function (require, exports, module) {

	require('modernizr');
	require('conditionizr');

	var app = require('app');
	var Index = require('views/Index');
	var Tracking = require('services/Tracking');

	// Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		routes: {
			"": "index",
			'*path': 'unknown'
		},
		initialize:function(){
			console.log("Router."+"initialize()", arguments);
		},
		unknown: function(route){
			console.warn("Router."+"unknown()", route);
			// console.log("Didn't find the route ", Backbone.history.fragment , ". Going to the intro.");

			this.navigate("", {
				trigger: true
			});
		},
		index: function () {
		}

	});

	return Router;

}); 

// entry point for requirejs

define(["require_config"], function (config) {

	var mm = require([
		"app",
		"router",
		"underscore",
		"jquery",
		"backbone",
		"../templates/runtime",
		"../templates/jade_jst"

	], function(App, Router, _, $, Backbone, jade) {

		// make jade available to the JST render functions
		window.jade = jade;

		var app = App;

			$.ajax({
				dataType: "json",
				url: "data/copy_en.json"
			}).done(function (response) {
					app.copy = response;
					startApp();
				}).fail(function (response) {
					console.error("Failed to get Site Copy: ", response.responseText);
				});

			function startApp() {

				// Trigger the initial route and enable HTML5 History API support, set the
				// root folder to '/' by default.  Change in app.js.
				app.listenToOnce(app.main, "render", function () {

					Backbone.history.start({
						// pushState: true,
						root: app.root
					});
					app.onResize();

				});
				// Define your master router on the application namespace and trigger all
				// navigation from this instance.
				app.router = new Router();
				app.main.render();

			}
		})
	});
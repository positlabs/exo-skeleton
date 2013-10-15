// Break out the application running from the configuration definition to
// assist with testing.

require(["config"], function() {

	// Kick off the application.
	var mm = require([
		"app",
		"router",
		"services/Tracking"
	], function(app, Router, Media, Preloader, Tracking) {

		Tracking.init();

		$.ajax({
			dataType: "json",
			url: "app/data/copy_" + lang + ".json"
		})
			.done(function(response) {
				app.copy = response;
				startApp();
			})
			.fail(function(response) {
				console.error("Failed to get Site Copy: ", response.responseText);
			});

		function startApp(){
			// app.ui.render();

			// Trigger the initial route and enable HTML5 History API support, set the
			// root folder to '/' by default.  Change in app.js.
			app.listenToOnce(app.ui, "afterRender", function(){

				Backbone.history.start({
					// pushState: true,
					root: app.root
				});
				app.onResize();

			});
			// Define your master router on the application namespace and trigger all
			// navigation from this instance.
			app.router = new Router();
			app.router.init();

		}
	});
});
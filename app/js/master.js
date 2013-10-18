// entry point for requirejs

define(["require_config"], function (config) {

	var mm = require([
		"app",
		"router",
		"underscore",
		"jquery",
		"backbone",
		"../templates/runtime",
		"../templates/jade_jst",
		"layoutmanager"

	], function (app, Router, _, $, Backbone, jade, jst, LayoutManager) {

		window.Backbone = Backbone;
		window._ = _;
		window.LayoutManager = LayoutManager;
		window.jade = jade;

		// Configure LayoutManager with Backbone Boilerplate defaults.
		Backbone.Layout.configure({
			// Allow LayoutManager to augment Backbone.View.prototype.
			manage: true,
			fetch: function (path) {
				console.log("path", path);
				return JST[path];
			}
		});

		$.ajax({
			dataType: "json",
			url: "data/copy_en.json"
		}).done(function (response) {
				app.copy = response;
				app.initialize();
			}).fail(function (response) {
				console.error("Failed to get Site Copy: ", response.responseText);
			});
	})
});
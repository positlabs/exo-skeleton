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
		"backbone.layoutmanager"

	], function (app, Router, _, $, Backbone, jade, jst) {

		window._ = _;
		window.$ = $;
		window.jade = jade;
		window.Backbone = Backbone;

		// Configure LayoutManager with Backbone Boilerplate defaults.
		Backbone.Layout.configure({
			// Allow LayoutManager to augment Backbone.View.prototype.
			manage: true,
			fetch: function (path) {
				console.log("fetch."+"fetch()", arguments);
				return JST[path];
			},
			fetchTemplate:function(path){
				console.log("fetchTemplate."+"fetchTemplate()", arguments);
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
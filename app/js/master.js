// entry point for requirejs
define(["require_config"], function () {

	require([

		"app",
		"underscore",
		"jquery",
		"backbone",
		"jade",
		"jade_jst",
		"backbone.layoutmanager"

	], function (app, _, $, Backbone, jade) {

		window.jade = jade;
		window._ = _;
		window.$ = $;
		window.app = app;
		window.Backbone = Backbone;

		Backbone.Layout.configure({
			manage: true,
			fetchTemplate: function (path) {
				return JST[path];
			}
		});

		$.ajax({
			dataType: "json",
			url: "data/copy_en.json"
		}).done(function (response) {
				app.copy = new Backbone.Model(response);
				app.initialize();
			}).fail(function (response) {
				console.error("Failed to get Site Copy: ", response.responseText);
			});
	})
});
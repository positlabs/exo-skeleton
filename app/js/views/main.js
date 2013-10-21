define(function (require, exports, module) {

	// main app container.

	var View = Backbone.View.extend({

		el: "#main",
		template: 'main',
		initialize: function () {
		},
		afterRender: function () {
		},
		serialize: function () {
			return _.extend({}, app.copy);
		}

	});

	return View;
});
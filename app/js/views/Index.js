define(function (require, exports, module) {

	var Backbone = require("backbone");


	/**
	 *
	 *  A view stub.
	 *
	 */

	var index = Backbone.View.extend({

		// template file relative to app/templates
		id:"index",
		template: "index",
		tagName: "div",
		className: "view",
		events:{
			// http://backbonejs.org/#Events-catalog
			"click":"onClick",
			"mouseover .some-button":"onBtnHover"
		},

		// built-in functions
		initialize: function(){},
		beforeRender: function(){},
		render: function(){},
		afterRender: function(){},

		// event handling
		onClick:function(){},
		onBtnHover:function(){}

	});

	return index;

});

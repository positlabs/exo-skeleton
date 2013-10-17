
require.config({
	paths: {

		"jquery": "bower/jquery/jquery.min",
		"backbone": "bower/backbone/backbone-min",
		"underscore": "bower/underscore/underscore-min",
		"modernizr": "bower/modernizr/modernizr",
		"conditionizr": "bower/conditionizr/src/conditionizr"

	},
	shim:{
		'jquery' : {
			"deps":[
//				"json3"
			]
		},
		'backbone':{
			export:"Backbone"
		}
	}

	// This will help with cache issues related to development.
	// urlArgs: "bust=" + Number(new Date())
});
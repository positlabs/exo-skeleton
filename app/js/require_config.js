
require.config({
	paths: {

		"jquery": "bower/jquery/jquery.min",
		"backbone": "bower/backbone-amd/backbone",
		"backbone.layoutmanager": "bower/layoutmanager/backbone.layoutmanager",
		"underscore": "bower/underscore-amd/underscore",
		"modernizr": "bower/modernizr/modernizr",
		"conditionizr": "bower/conditionizr/dist/conditionizr",
		"jade": "bower/jade/runtime",
		"jade_jst": "../templates/jade_jst"

	},
	shim:{
//		jquery : {
//		},
//		layoutmanager:{
//			deps:[
//				"backbone"
//			]
//		}
	}

	// This will help with cache issues related to development.
	// urlArgs: "bust=" + Number(new Date())
});
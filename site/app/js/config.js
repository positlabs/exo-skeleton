// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
	paths: {
		// Make vendor easier to access.
		"vendor": "../vendor",
		"bower": "../vendor/bower",

		"jquery": "../../bower_components/jquery/jquery.min",
		"backbone": "../../bower_components/backbone/backbone-min",
		"underscore": "../../bower_components/underscore/underscore-min",
		"modernizr": "../../bower_components/modernizr/modernizr",
		"conditionizr":"../../bower_components/conditionizr/src/conditionizr"

	},
	shim:{
		'jquery' : {
			"deps":[
//				"json3"
			]
		}
	}

	// This will help with cache issues related to development.
	// urlArgs: "bust=" + Number(new Date())
});
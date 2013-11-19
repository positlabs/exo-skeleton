
require.config({
	paths: {

		"jquery": "bower/jquery/jquery.min",
		"backbone": "bower/backbone-amd/backbone",
		"backbone.layoutmanager": "bower/layoutmanager/backbone.layoutmanager",
		"underscore": "bower/underscore-amd/underscore",
		"modernizr": "bower/modernizr/modernizr",

		"conditionizr": "bower/conditionizr/dist/conditionizr",
		"conditionizr.chrome": "bower/conditionizr/detects/chrome",
		"conditionizr.chromium": "bower/conditionizr/detects/chromium",
		"conditionizr.firefox": "bower/conditionizr/detects/firefox",
		"conditionizr.ie6": "bower/conditionizr/detects/ie6",
		"conditionizr.ie7": "bower/conditionizr/detects/ie7",
		"conditionizr.ie8": "bower/conditionizr/detects/ie8",
		"conditionizr.ie9": "bower/conditionizr/detects/ie9",
		"conditionizr.ie10": "bower/conditionizr/detects/ie10",
		"conditionizr.ie10touch": "bower/conditionizr/detects/ie10touch",
		"conditionizr.ie11": "bower/conditionizr/detects/ie11",
		"conditionizr.ios": "bower/conditionizr/detects/ios",
		"conditionizr.linux": "bower/conditionizr/detects/linux",
		"conditionizr.mac": "bower/conditionizr/detects/mac",
		"conditionizr.opera": "bower/conditionizr/detects/opera",
		"conditionizr.retina": "bower/conditionizr/detects/retina",
		"conditionizr.safari": "bower/conditionizr/detects/safari",
		"conditionizr.touch": "bower/conditionizr/detects/touch",
		"conditionizr.windows": "bower/conditionizr/detects/windows",
		"conditionizr.winPhone7": "bower/conditionizr/detects/winPhone7",
		"conditionizr.winPhone75": "bower/conditionizr/detects/winPhone75",
		"conditionizr.winPhone8": "bower/conditionizr/detects/winPhone8",

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
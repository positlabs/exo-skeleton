// Grunt ration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function (grunt) {

	grunt.initConfig({
		// Easier location to change the default debug and release folders.
		dist: {
			debug: "dist/debug/",
			release: "dist/release/"
		},

		watch: {
			css: {
				files: [
					"Gruntfile.js",
					"app/styles/*.less"
				],
				tasks: "less"
			},
			templates:{
				files:[
					"Gruntfile.js",
					"app/templates/*.jade"
				],
				tasks: "grunt-jade"
			}
		},

		"jade": {
			"debug": {
				"files": {
					"app/templates/compiled/": ["app/templates/*.jade"]
				},
				"options": {
					"compileDebug": true,
					"locals": {
						compileTime:function(){return Date.now();}
					}
				}
			}
		},

		less: {
			options: {
				paths: ["app/styles"]
			},
			src: {
				expand: true,
				cwd: "app/styles",
				src: "*.less",
				dest: "app/styles",
				ext: ".css"
			}
		}

	});

	// Grunt contribution tasks.
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");

	// Third-party tasks.
	grunt.loadNpmTasks('grunt-jade');

//	grunt.registerTask("watch", [
//		"jade", "templates", "watch"
//		"watch"
//	]);

	grunt.registerTask("grunt-contrib-less", ["lessc"]);
	// compile jade templates
	grunt.registerTask("grunt-jade", ["jade"]);

	// When running the default Grunt command, just lint the code.
	grunt.registerTask("default", ["jshint"]);

};
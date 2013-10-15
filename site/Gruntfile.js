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
					"app/templates/**/*.jade"
				],
				tasks: "jade"
			}
		},

		jade: {
			compile: {
				options: {
					compileDebug:false,
					data: {
						debug: false
					},
					client:true
				},
				files: {
					"app/templates/jade_tmpls.js": ["app/templates/*.jade"]
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
	grunt.loadNpmTasks('grunt-contrib-jade');

	// When running the default Grunt command, just lint the code.
	grunt.registerTask("default", ["jshint"]);

	//TODO - compiling

};
// Grunt ration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function (grunt) {

	grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 8888,
					hostname:'localhost',
					base: 'app/',
					keepalive:true,
					open:true
				}
			}
		},
		// run grunt watcher.
		// handles stuff that needs pre-processing
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
					client:true,
					processName: function(filename) {
						// give the JST a key that's relative to app/templates
						console.log("filename",filename);
						return filename.replace("app/templates/", "").replace(".jade", "");
					}
				},
				files: {
					"app/templates/jade_jst.js": ["app/templates/*.jade"]
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
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');

	// start watching. do initial pre-process of files
	grunt.registerTask("watcher", ["jade", "less", "watch"]);
	grunt.registerTask("server", ["connect"]);

	// start server, watch files
//	grunt.registerTask("default", ["watch"]);

	//TODO - compiling

};
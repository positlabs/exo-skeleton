// Grunt ration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function (grunt) {

	grunt.initConfig({

		yeoman: {
			app:"app/",
			dist: "dist/"
		},

		concurrent:{
			server:[
				"connect",
				"watcher"
			]
		},

		connect: {
			options: {
				// change this to '0.0.0.0' to access the server from outside
				hostname:'localhost',
				port: 8888,
				livereload: 35729,
				base: 'app/',
				keepalive:true,
				open:true
			},
			livereload: {
				options: {
					base: [
						'.tmp',
						'<%= yeoman.app %>'
					]
				}
			},
			test: {
				options: {
					base: [
						'.tmp',
						'test',
						'<%= yeoman.app %>'
					]
				}
			},
			dist: {
				options: {
					base: '<%= yeoman.dist %>'
				}
			}
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
//			livereload: {
//				options: {
//					livereload: '<%= connect.server.options.livereload %>'
//				},
//				files: [
//					'<%= yeoman.app %>/*.html',
//					'.tmp/styles/{,*/}*.css',
//					'{.tmp,<%= yeoman.app %>}/js/{,*/}*.js',
//					'<%= yeoman.app %>/assets/imgs/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
//				]
//			}
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
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

//		requirejs: {
//			dist: {
//				// Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
//				options: {
//					// `name` and `out` is set by grunt-usemin
//					baseUrl: '<%= yeoman.app %>/js',
//					optimize: 'none',
//					preserveLicenseComments: false,
//					useStrict: true,
//					wrap: true
//					//uglify2: {} // https://github.com/mishoo/UglifyJS2
//				}
//			}
//		},

		// This task uses James Burke's excellent r.js AMD builder to take all
		// modules and concatenate them into a single file.
		requirejs: {
			debug: {
				options: {
					// Include the main ration file.
					mainConfigFile: "app/require_config.js",

					// Output file.
					out: "<%= yeoman.dist %>source.js",

					// Root application module.
					name: "config",

					// Include the main application.
					insertRequire: ["index"],

					// This will ensure the application runs after being built.
					include: [
						"index",
						"router"
					],

					// Wrap everything in an IIFE.
					wrap: true
				}
			}
		},

		imagemin:{
			//TODO: configure
//			https://github.com/gruntjs/grunt-contrib-imagemin
		},

		targethtml: {
			release: {
				files: {
					'<%= yeoman.dist %>index.html': 'index.html'
				}
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks("grunt-targethtml");
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-modernizr');


	// start watching files. also does initial pre-process of files
	grunt.registerTask("watcher", ["jade", "less", "watch"]);

	grunt.registerTask("server", ["concurrent:server"]);

	// The release task will first run the debug tasks.  Following that, minify
	// the built JavaScript and then minify the built CSS.
	grunt.registerTask('build', [
		"jade",
		"less",
		'clean:dist',
		'concurrent:dist',
		'requirejs',
		'concat',
		'cssmin',
		'uglify',
		'modernizr',
		'copy:dist',
		'rev',
		"targethtml:release"
	]);

	// https://npmjs.org/package/grunt-ftpush
//	grunt.registerTask('deploy', []);

	grunt.registerTask("default", [
		"build",
		"deploy"
	]);

};
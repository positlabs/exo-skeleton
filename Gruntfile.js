// Grunt ration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function (grunt) {

	// point to your stuff!
	var yeoman = {
		require_config: "app/js/require_config",

		dist: "dist/",

		app: "app/",
		styles: "app/styles/",
		scripts: "app/js/",
		templates: "app/templates/",
		data: "app/data/",
		images: "app/assets/imgs/",
		fonts: "app/assets/fonts/",
		videos: "app/assets/videos/",
		sounds: "app/assets/sounds/"

	};

	var cfg = {

		yeoman: yeoman,

		// https://github.com/sindresorhus/grunt-concurrent
		concurrent: {
			server: [
				"connect",
				"watcher"
			]
		},

		// https://github.com/gruntjs/grunt-contrib-connect
		connect: {
			options: {
				// change this to '0.0.0.0' to access the server from outside
				hostname:'localhost',
				port: 8888,
				livereload: 35729,
				base: yeoman.app,
				keepalive:true,
				open:true
			},
			livereload: {
				options: {
					base: [
						yeoman.app
					]
				}
			},
			dist: {
				options: {
					base: yeoman.dist
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-watch
		watch: {
			css: {
				files: [
					"Gruntfile.js",
					yeoman.styles + "/*.less"
				],
				tasks: "less"
			},
			templates: {
				files: [
					"Gruntfile.js",
					yeoman.templates + "/**/*.jade"

				],
				tasks: "jade"
			}
		},

		// https://github.com/gruntjs/grunt-contrib-jade
		// TODO - make debug / dist options
		jade: {
			compile: {
				options: {
					compileDebug: false,
					data: {
						debug: false
					},
					client: true,
					processName: function (filename) {
						// give the JST a key that's relative to app/templates
						return filename.replace(yeoman.templates, '').replace('.jade', '');
					}
				},
				files: {
					"app/templates/jade_jst.js": [yeoman.templates + "/*.jade"]
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-less
		less: {
			options: {
				paths: [yeoman.styles]
			},
			src: {
				expand: true,
				cwd: yeoman.styles,
				src: "*.less",
				dest: yeoman.styles,
				ext: ".css"
			}
		},

		clean: {
			dist: [yeoman.dist]

		},

		// Put files not handled in other tasks here
		//TODO - configure
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: yeoman.app,
						dest: yeoman.dist,
						src: [
							'*.{ico,txt}',
							'.htaccess',
							yeoman.data, ,
							yeoman.fonts,
							yeoman.sounds,
							yeoman.videos
						]
					}
				]
			}//,
			// what is this for?
//			styles: {
//				expand: true,
//				dot: true,
//				cwd: '<%= yeoman.app %>/styles',
//				dest: '.tmp/styles/',
//				src: '{,*/}*.css'
//			}
		},

		// This task uses James Burke's excellent r.js AMD builder to take all
		// modules and concatenate them into a single file.
		// https://github.com/jrburke/r.js/blob/master/build/example.build.js
		requirejs: {
			compile: {
				options: {
					preserveLicenseComments: false,
					baseUrl: yeoman.scripts,
					mainConfigFile: yeoman.require_config + ".js",
					out: yeoman.dist + "/source.js",

					// Root application module.
					name: "master",

					// Include the main application.
					insertRequire: ["master"],

					// This will ensure the application runs after being built.
					include: [
						"app",
						"master",
						"router",
						"views/Main"
					]
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-cssmin
		cssmin: {
			combine: {
				files: {
					"<%= yeoman.dist + 'styles.css' %>": [yeoman.styles + "master.css"]

				}
			}
		},

		// don't worry about running often. results are cached, and the process only re-runs on the changed files
		// https://github.com/gruntjs/grunt-contrib-imagemin
		imagemin: {
			options: {
				pngquant: true
			},
			dynamic: {
				files: [
					{
						expand: true,
						src: [yeoman.images + '/*.{png,jpg,gif}'],
						dest: yeoman.dist
					}
				]
			}
		},

		// https://github.com/changer/grunt-targethtml
		targethtml: {
			dist: {
				files: {
					'<%= yeoman.dist %>index.html': 'index.html'
				}
			}
		}

	};

	grunt.initConfig(cfg);

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks("grunt-targethtml");
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-modernizr');


	/**
	 *
	 *  TASK DEFINITIONS
	 *
	 */

		// start watching files. also does an initial batch process of target files
	grunt.registerTask("watcher", [
		"jade",
		"less",
		"watch"
	]);

	// start watching files, start a server
	grunt.registerTask("server", ["concurrent:server"]);

	// The release task will first run the debug tasks.  Following that, minify
	// the built JavaScript and then minify the built CSS.
	grunt.registerTask('build', [
		"jade",
		"less",
		'clean:dist',
		'requirejs',
		'cssmin',
		'modernizr',
		'copy:dist',
		"imagemin",
		"targethtml:dist"
	]);

	// https://npmjs.org/package/grunt-ftpush
	// grunt.registerTask('deploy', []);

	grunt.registerTask("default", [
		"build",
		"deploy"
	]);

};
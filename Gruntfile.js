module.exports = function (grunt) {

	// point to your stuff!
	var yeoman = {
		almond: "app/js/bower/almond/almond",
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
				"php:dev",
				"watcher"
			]
		},

		// https://github.com/sindresorhus/grunt-php
		php: {
			options: {
				// change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost',
				port: 8888,
				livereload: 35729,
				base: yeoman.app,
				keepalive: true,
				open: true,
				router: 'router.php'
			},
			dev: {
				options: {
					base: yeoman.app
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
		jade: {
			debug: {
				options: {
					compileDebug: true,
					data: {
						debug: true
					},
					client: true, // compile to jst, not html
					processName: function (filename) {
						// give the JST a key that's relative to templates directory
						return filename.replace(yeoman.templates, '').replace('.jade', '');
					}
					// amd:true
				},
				files: {
					"<%= yeoman.templates %>jade_jst.js": [yeoman.templates + "/*.jade"]
				}
			},
			dist: {
				options: {
					compileDebug: false,
					data: {
						debug: false
					},
					client: true, // compile to jst, not html
					processName: function (filename) {
						// give the JST a key that's relative to templates directory
						return filename.replace(yeoman.templates, '').replace('.jade', '');
					}
				},
				files: {
					"<%= yeoman.templates %>jade_jst.js": [yeoman.templates + "/*.jade"]
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
		// https://github.com/gruntjs/grunt-contrib-copy
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
							yeoman.data.replace(yeoman.app, "") + "**/*",
							yeoman.fonts.replace(yeoman.app, "") + "**/*",
							yeoman.sounds.replace(yeoman.app, "") + "**/*",
							yeoman.videos.replace(yeoman.app, "") + "**/*"
						]
					}
				]
			}
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
					name: "bower/almond/almond",

					// Include the main application.
					insertRequire: ["master"],

					// This will ensure the application runs after being built.
					include: [

						"app",
						"master",
						"router",
						"views/Main",
						"jade",
						"jade_jst",
						"backbone",
						"backbone.layoutmanager"

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
						cwd: yeoman.app,
						src: [yeoman.images.replace(yeoman.app, "") + '/*.{png,jpg,gif}'],
						dest: yeoman.dist
					}
				]
			}
		},

		// https://github.com/changer/grunt-targethtml
		targethtml: {
			dist: {
				files: {
					'<%= yeoman.dist %>index.html': yeoman.app + 'index.html'
				}
			}
		},

		// https://npmjs.org/package/grunt-ftpush
		// username / passwords need to be stored in .ftppass
		//		{
		//			"key1": {
		//			    "username": "username1",
		//				"password": "password1"
		//  		}
		//		}
		ftpush: {
			dist: {
				auth: {
					host: 'toolofnadrive.com',
					port: 21,
					authKey: 'key1'
				},
				src: yeoman.dist,
				dest: "subdomains/josh-dev/exo-skeleton/"
				// exclusions: ['path/to/source/folder/**/.DS_Store', 'path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
				// keep: ['/important/images/at/server/*.jpg']
			}
		},

		// https://github.com/jsoverson/grunt-open
		open: {
			dev:{
				path: "http://localhost:<%= php.options.port %>"
			},
			dist: {
				path: 'http://josh-dev.toolofnadrive.com/exo-skeleton'
			}
		}


	};

	grunt.initConfig(cfg);

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.loadNpmTasks('grunt-php');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-ftpush');
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks("grunt-targethtml");
	grunt.loadNpmTasks('grunt-concurrent');


	/**
	 *
	 *  TASK DEFINITIONS
	 *
	 */

	// start watching files. also does an initial batch process of target files
	grunt.registerTask("watcher", [
		"jade:debug",
		"less",
		"watch"
	]);

	// start watching files, start a server
	grunt.registerTask("server", [
		"less",
		"jade",
		"open:dev",
		"concurrent:server"
	]);

	// save as above, but points to dist version
	grunt.registerTask("server:dist", [
		"open:dev",
		"php:dist"
	]);

	// The release task will first run the debug tasks.  Following that, minify
	// the built JavaScript and then minify the built CSS.
	grunt.registerTask('build', [
		"jade:dist",
		"less",
		'clean:dist',
		'requirejs',
		'cssmin',
		'copy:dist',
		"imagemin",
		"targethtml:dist"
	]);

	// https://npmjs.org/package/grunt-ftpush
	grunt.registerTask('deploy', [
		"ftpush:dist",
		"open:dist"
	]);

	grunt.registerTask("default", [
		"build",
		"deploy"
	]);

};
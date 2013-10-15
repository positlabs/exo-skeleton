// Grunt ration updated to latest Grunt.  That means your minimum
// version necessary to run these tasks is Grunt 0.4.
module.exports = function (grunt) {

	grunt.initConfig({
		// Easier location to change the default debug and release folders.
		dist: {
			debug: "dist/debug/",
			release: "dist/release/"
		},

		// Runs the application JavaScript through JSHint with the defaults.
		jshint: {
			files: ["app/**/*.js"]
		},

		watch: {
			css: {
				files: [
					"Gruntfile.js",
					"app/styles/*.less"
				],
				tasks: "less"
			},
			jade:{
				files:[
					"Gruntfile.js",
					"app/templates/*.jade"
				],
				tasks: "jade"
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

		// This task uses James Burke's excellent r.js AMD builder to take all
		// modules and concatenate them into a single file.
		requirejs: {
			debug: {
				options: {
					// Include the main ration file.
					mainConfigFile: "app/config.js",

					// Output file.
					out: "<%= dist.debug %>source.js",

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
					wrap: true,
					paths: {
						'klang': 'empty:'
					}
				}
			}
		},

		// Combine the Almond AMD loader and precompiled templates with the
		// application source code.
		concat: {
			dist: {
				src: [
					"<%= dist.debug %>templates.js",
					"<%= dist.debug %>source.js"
				],

				dest: "<%= dist.debug %>source.js",

				separator: ";"
			}
		},

		// This task uses the MinCSS Node.js project to take all your CSS files in
		// order and concatenate them into a single CSS file named index.css.  It
		// also minifies all the CSS as well.  This is named index.css, because we
		// only want to load one stylesheet in index.html.
		cssmin: {
			release: {
				files: {
					"<%= dist.release %>index.css": ["<%= dist.debug %>index.css"]
				}
			}
		},

		// Minify the application built source and generate source maps back to
		// the original debug build.
		uglify: {
			options: {
				sourceMap: "source.js.map",
				sourceMapRoot: "",
				sourceMapPrefix: 1,
				preserveComments: "some"
			},

			release: {
				files: {
					"<%= dist.release %>source.js": ["<%= dist.debug %>source.js"]
				}
			}
		},

		// The clean task ensures all files are removed from the dist/ directory so
		// that no files linger from previous builds.
		clean: ["dist/"],

		server: {
			options: {
				// Default server settings that are ideal for local development.
				host: "0.0.0.0",
				port: 8000,

				// Add any additional directories you want to automatically compile
				// CommonJS modules in.
				moduleDirs: [
					// Source.
					"app",

					// Testing directories.
					"test/jasmine/spec",
					"test/mocha/tests",
					"test/qunit/tests"
				],

				// Root entry point during development is RequireJS, this loads the rest
				// of the application.
				map: {
					"source.js": "vendor/jam/require.js",
					"app/styles/app/img": "app/img",
					"app/styles/app/fonts": "app/fonts"
				}
			},

			development: {
				options: {}
			},

			debug: {
				options: {
					map: {
						// Source.
						"source.js": "<%= dist.debug %>source.js",

						// Styles.
						"app/styles/index.css": "<%= dist.debug %>index.css"
					}
				}
			},

			release: {
				options: {
					map: {
						// Debugging.
						"source.js.map": "<%= dist.release %>source.js.map",
						"debug/source.js": "<%= dist.release %>debug/source.js",

						// Source.
						"source.js": "<%= dist.release %>source.js",

						// Styles.
						"app/styles/index.css": "<%= dist.release %>index.css"
					}
				}
			},

			// Specifically used for testing the application.
			test: {
				options: {
					forever: false,
					port: 8001
				}
			}
		},
		targethtml: {
			debug: {
				files: {
					'<%= dist.debug %>index.html': 'index.html'
				}
			},
			release: {
				files: {
					'<%= dist.release %>index.html': 'index.html'
				}
			}
		},

		// Move vendor and app logic during a build.
		copy: {
			debug: {
				files: [
					{
						// 	src: ["api/**"],
						// 	dest: "<%= dist.debug %>"
						// }, {
						// 	src: ["app/**"],
						// 	dest: "<%= dist.debug %>"
						// }, {
						// 	src: "vendor/**",
						// 	dest: "<%= dist.debug %>"
						// }
						// , {
						// 	src: "index.html",
						// 	dest: "<%= dist.debug %>index.html"
						// }, {
						src: "points.json",
						dest: "<%= dist.debug %>points.json"
					}
				]
			},

			release: {
				files: [
					{
						src: "<%= dist.debug %>source.js",
						dest: "<%= dist.release %>debug/source.js"
					}
				]
			}
		},

		compress: {
			release: {
				files: {
					"<%= dist.release %>source.js.gz": "<%= dist.release %>source.js",
					"<%= dist.release %>styles.css.gz": "<%= dist.release %>styles.css"
				}
			}
		},

	});

	// Grunt contribution tasks.
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-targethtml");

	// Third-party tasks.
	grunt.loadNpmTasks('grunt-jade');

	// Grunt BBB tasks.
	grunt.loadNpmTasks("grunt-bbb-server");
	grunt.loadNpmTasks("grunt-bbb-requirejs");
	grunt.loadNpmTasks("grunt-bbb-styles");

	// grunt.registerTask("watch", [
	// 	"less", "styles", "watch"
	// ]);

	// This will reset the build, be the precursor to the production
	// optimizations, and serve as a good intermediary for debugging.
	grunt.registerTask("debug", [
		"clean", "jade", "requirejs", "concat", "styles", "targethtml:debug"
	]);

	// The release task will first run the debug tasks.  Following that, minify
	// the built JavaScript and then minify the built CSS.
	grunt.registerTask("release", [
		"debug", "copy", "uglify", "cssmin", "compress", "targethtml:release"
	]);

	// compile jade templates
	grunt.registerTask("grunt-jade", ["jade"]);

	// When running the default Grunt command, just lint the code.
	grunt.registerTask("default", ["jshint"]);

};
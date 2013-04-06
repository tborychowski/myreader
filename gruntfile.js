/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cfg: {
			jssrc  : 'web-src/js',
			jsdest : 'public/js',
			stylus : 'web-src/styl',
			css    : 'public/css'
		},

		jshint: {
			options: {
				browser   : true,
				jquery    : true,

				bitwise   : true,
				boss      : true,
				//camelcase : true,
				eqeqeq    : true,
				immed     : true,
				indent    : 4,
				latedef   : true,
				maxlen    : 130,
				newcap    : true,
				noarg     : true,
				noempty   : true,
				nonew     : true,
				onevar    : true,
				quotmark  : true,
				smarttabs : true,
				//strict    : true,
				trailing  : true,
				//undef     : true,
				//unused    : true,
				white     : true
			},
			files: [
				'<%= cfg.jssrc %>/**/*.js',
				'!<%= cfg.jssrc %>/jquery/*.js',
				'!<%= cfg.jssrc %>/selfoss/*.js',
				'!<%= cfg.jssrc %>/widgets/*.js'
			]
		},

		concat: {
			jquery:  { src: [ '<%= cfg.jssrc %>/jquery/*.js' ], dest: '<%= cfg.jsdest %>/jquery.min.js' },

			widgets: {
				src: ['<%= cfg.jssrc %>/widgets/*.js'],
				dest: '<%= cfg.jsdest %>/widgets.js'
			},
			modules: {
				src: ['<%= cfg.jssrc %>/modules/*.js'],
				dest: '<%= cfg.jsdest %>/modules.js'
			},
			app:     {
				src: ['<%= cfg.jssrc %>/app/*.js'],
				dest: '<%= cfg.jsdest %>/app.js'
			}
		},

		uglify: {
			widgets : '<%= concat.widgets %>',
			modules : '<%= concat.modules %>',
			app     : '<%= concat.app %>'
		},

		stylus: {
			dev: {
				options: { compress: true, paths: [ '<%= cfg.stylus %>' ] },
				files: {
					'<%= cfg.css %>/style.css' : [ '<%= cfg.stylus %>/style.styl', '<%= cfg.stylus %>/widgets/*.styl' ]
				}
			},
			prod: {
				options: { yuicompress: true, paths: '<%= stylus.dev.options.paths %>' },
				files: '<%= stylus.dev.files %>'
			}
		},

		watch: {
			js:   {
				files: '<%= cfg.jssrc %>/**/*.js',
				tasks: ['jshint', 'concat' ]
			},
			css: {
				files: '<%= cfg.stylus %>/**/*.styl',
				tasks: [ 'stylus:dev' ]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [ 'jshint', 'concat', 'stylus:dev' ]);		// Default task.
	grunt.registerTask('prod', [ 'jshint', 'concat', 'uglify', 'stylus:prod' ]);
};
/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cfg: { src  : 'web-src', dest : 'public' },
		jshint: {
			options: { jshintrc: '<%= cfg.src %>/js/.jshintrc' },
			files: [ '<%= cfg.src %>/js/**/*.js', '!<%= cfg.src %>/js/jquery/*.js' ]
		},
		concat: {
			lib: { src: [ '<%= cfg.src %>/js/jquery/*.js' ], dest: '<%= cfg.dest %>/js/lib.js' },
			app: { src: ['<%= cfg.src %>/js/app/*.js',
				'<%= cfg.src %>/js/modules/*.js' ],          dest: '<%= cfg.dest %>/js/app.js' }
		},
		uglify: { app : '<%= concat.app %>' },
		stylus: {
			dev: {
				options: { compress: true, paths: [ '<%= cfg.stylus %>' ] },
				files: {
					'<%= cfg.dest %>/css/style.css' : [
						'<%= cfg.src %>/styl/common.styl',
						'<%= cfg.src %>/styl/modules/*.styl',
						'<%= cfg.src %>/styl/responsive.styl'
					]}
			},
			prod: {
				options: { yuicompress: true, paths: '<%= stylus.dev.options.paths %>' },
				files: '<%= stylus.dev.files %>'
			}
		},
		watch: {
			js:  { files: '<%= cfg.src %>/js/**/*.js',     tasks: [ 'jshint', 'concat' ] },
			css: { files: '<%= cfg.src %>/styl/**/*.styl', tasks: [ 'stylus:dev' ] }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', [ 'jshint', 'concat', 'stylus:dev' ]);
	grunt.registerTask('prod', [ 'jshint', 'concat', 'uglify', 'stylus:prod' ]);
};
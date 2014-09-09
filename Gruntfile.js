/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://lab.hakim.se/reveal-js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2013 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		cssmin: {
			compress: {
				files: {
					'css/style-edit.min.css': [ 'css/style-edit.css' ]
				}
			}
		},

		sass: {
			main: {
				files: {
					'css/style-edit.css': 'css/style-edit.scss'
				}
			}
		},

		connect: {
			server: {
				options: {
					port: port,
					base: '.'
				}
			}
		},


		watch: {
			styles: {
				files: [ 'css/*.scss'],
				tasks: 'style'
			}
		}

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );

	// Default task
	grunt.registerTask( 'default', [ 'watch' ] );

	// Theme task
	grunt.registerTask( 'style', [ 'sass' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	// grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

};

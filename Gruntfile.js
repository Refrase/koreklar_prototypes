module.exports = function(grunt) {

	// 1. Configure tasks
  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    // Compile .scss-files in 'dev' folder into 1 style.css file that WP can read
		sass: {
			dev: {
				options: {
					outputStyle: 'expanded' // 'expanded' = makes the output .css-file easy to read
				},
				files: {
					'style.css': 'dev/scss/style.scss'
				}
			},
			build: {
				options: {
					outputStyle: 'compressed' // 'compressed' = minifies the output for live server
				},
				files: {
					'style.css': 'dev/scss/style.scss'
				}
			}
		},

    autoprefixer:{
      dist:{
        files:{
          'style.css':'style.css'
        }
      }
    },

    // Initialize 'grunt watch'-task with livereload (also install livereload plugin in browser to make it work)
		watch: {
      options: { livereload: true },
			css: {
        files: [ 'dev/scss/**/*.scss' ],
				tasks: [ 'sass:dev', 'autoprefixer' ] // Concatenate styles on change, but don't minify while developing (see options under 'sass' ^)
			},
      livereload: {
        files: [ '*.html', 'images/**/*.{png,jpg,jpeg,gif,webp,svg}' ]
      }
		},
    express:{
      all:{
        options:{
          port: 3000,
          hostname: 'localhost',
          bases: ['./'],
          livereload: true
        }
      }
    }

  });

  // 2. Load plugins
  grunt.loadNpmTasks( 'grunt-express' );
  grunt.loadNpmTasks( 'grunt-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' ); // Runs on command 'grunt watch'
  grunt.loadNpmTasks( 'grunt-autoprefixer' );

  // 3. Register task(s)
  grunt.registerTask( 'serve', [ 'express', 'watch' ]); // Runs on command 'grunt serve'
  grunt.registerTask( 'uglify', [ 'sass:dev', 'autoprefixer' ]); // Runs on command 'grunt uglify'
  grunt.registerTask( 'build', [ 'sass:build', 'autoprefixer' ]); // Runs on command 'grunt build'
};

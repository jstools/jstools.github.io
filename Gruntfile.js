module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// This shows system notifications. is very useful for debug
	grunt.task.run('notify_hooks');

  // Project configuration.
  grunt.initConfig({

  	dir: {
  		tmp: '.tmp',
  		public: 'public',
			bower: grunt.file.readJSON('.bowerrc').directory || '.bower_components'
  	},

    pkg: grunt.file.readJSON('package.json'),

    clean: ["<%= dir.tmp %>", "<%= dir.public %>", 'page'],

    copy: {
    	assets: {
    		expand: true,
		    src: 'assets/{,**/}*',
		    dest: '<%= dir.public %>/',
		    filter: 'isFile'
			}
    },

    less: {
			development: {
				options: {
					paths: ["assets/css"]
				},
				files: {
				 "assets/jstools.css": "styles/index.less"
				}
			}
		},

		copyDependencies: {
			libs: {
				dest: 'lib'
			},
			devLibs: {
				dest: 'lib',
				src: 'devDependencies'
			}
		},

		watch: {
			assets: {
				files: ['assets/{,**/}*'],
				tasks: ['copy:assets']
			},
			index: {
				files: ['index.html']
			},
		  less: {
		    files: ['styles/{,**/}*.less'],
		    tasks: ['less'],
		    options: {
		      spawn: false,
		    }
		  },
			builder: {
				files: ['_grunt/**', 'templates/**'],
				tasks: ['build-pages:dev']
			},
		  options: {
		  	livereload: 54321
		  }
		},

		fileserver: {
	    server1: {
	      options: {
	        port: 8080,
	        hostname: '0.0.0.0',
	        cwd: '.',
	        // root: 'test',
	        // dirAlias: {
	        //   'dist': 'dist'
	        // },
	        keepalive: false,
	        onStart: function(){ console.log('server started'); },
	        onStop: function(){ console.log('server stopped'); },
	        openInBrowser: true,   // true (for default browser) or app name (eg: 'chrome', 'firefox')
	        addExtension: 'html'   // add extension to url not ended in '/'
	      }
	    }
	  }

  });

	grunt.registerTask('build-pages:dev', function () {
		require('./_grunt/site-builder.js')({ debug: true });
	});

	grunt.registerTask('build-pages:dist', function () {
		require('./_grunt/site-builder.js')();
	});

  grunt.registerTask('dev', ['clean', 'copyDependencies', 'build-pages:dev', 'less', 'fileserver', 'watch']);

  grunt.registerTask('build', ['clean', 'copyDependencies', 'build-pages:dist', 'less']);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};

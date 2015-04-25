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
  		'tmp': '.tmp',
  		'public': 'public'
  	},

    pkg: grunt.file.readJSON('package.json'),

    clean: ["<%= dir.tmp %>", "<%= dir.public %>"],
    
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
				 "<%= dir.public %>/jstools.css": "styles/index.less"
				}
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

	
	grunt.registerTask('copy-jengine', function () {
		grunt.file.copy('node_modules/jengine/jEngine.js', 'public/jEngine.js');
	});

  grunt.registerTask('dev', ['clean', 'copy:assets', 'copy-jengine', 'less', 'fileserver', 'watch']);

  grunt.registerTask('build', ['clean', 'copy:assets', 'copy-jengine', 'less']);

  // Default task(s).
  grunt.registerTask('default', ['build']);

};
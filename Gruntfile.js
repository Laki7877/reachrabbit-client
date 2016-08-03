/**
 * gulp entry point
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    concurrent: {
        dev: {
            tasks: ['watch', 'connect'],
            options: {
                logConcurrentOutput: true
            }
        }
    },
    watch: {
        files: "app/less/*.less",
        tasks: ["less"]
    },
    less: {
      options: {
         paths: ["app/less/", "app/bower_components/bootstrap/less/", "app/bower_components/font-awesome/css/"],
      },
      development: {
        files: {
          'app/css/app.css': 'app/less/app.less'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: process.env.PORT || 8000,
          base: 'app',
          keepalive: true
        }
      }
    },
    //ensure user got githooks
    githooks: {
      all: {
        options:{
          'startMarker': grunt.file.read('signature.txt'),
          'endMarker': 'process.exit(0)'
        },
        'pre-commit': 'jshint',
      }
    },
    //JSHint code check
    jshint: {
      files: ['app/**/*.js'],
      options: {
        ignores: ['app/bower_components/**/*.js'],
        globals: {
          jQuery: true,
          angular: true
        }
      }
    }
  });


  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  // Default task(s).
  grunt.registerTask('default', ['githooks', 'jshint', 'concurrent:dev']);

}; 
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

  // Default task(s).
  grunt.registerTask('default', ['githooks', 'jshint']);

}; 
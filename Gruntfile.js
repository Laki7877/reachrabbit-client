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
    copy: {
      hooks: {
        files: {
           ".git/hooks/pre-commit": "hooks/pre-commit"
        }
      }
    },
    concurrent: {
        dev: {
            tasks: ['shell:autoless', 'connect:server'],
            options: {
                logConcurrentOutput: true
            }
        },
        test:{
          tasks: ['connect:testserver', 'shell:protractor']
        },
        testff: {
          tasks: ['connect:testserver', 'shell:protractorff']
        }
    },
    shell: {
        autoless: {
             command: 'node node_modules/autoless/bin/autoless app/less app/css',
             options: {
                stderr: true
            }
        },
        protractor: {
          command: 'npm run protractor-test',
             options: {
                stderr: true,
                stdout: true
            }
        },
        protractorff:{
          command: 'npm run protractor-test-ff',
          options:{
            stderr:true,
            stdout:true
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
          port: process.env.PORT || 8080,
          base: 'app',
          keepalive: true
        }
      },
      testserver: {
        options: {
          port: 9900,
          base: 'app',
          keepalive: true
        }
      }
    },
    //JSHint code check
    jshint: {
      files: ['app/**/*.js'],
      options: {
        ignores: ['app/bower_components/**/*.js'],
        globals: {
          jQuery: true,
          angular: true,
          window: true,
          moment: true,
          history: true,
          document: true,
          sjcl: true,
          $: true,
          _: true,
          Raven: true
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concurrent:dev']);
  grunt.registerTask('test', ['concurrent:test']);
  grunt.registerTask('testff', ['concurrent:testff']);

};
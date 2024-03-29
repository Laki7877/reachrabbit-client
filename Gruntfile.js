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
          ".git/hooks/pre-commit": "hooks/pre-commit",
          ".git/hooks/post-merge": "hooks/post-merge"
        }
      }
    },
    browserify: {
      vendor: {
        files: {
          'dist/vendor.js': ['app/vendor.js'],
        },
        options: {
          transform: []
        }
      },
      src: {
        files: {
          'dist/bundle.admin.js': ['app/js/app.admin.js'],
          'dist/bundle.influencer.js': ['app/js/app.influencer.js'],
          'dist/bundle.brand.js': ['app/js/app.brand.js']
        },
        options: {
          transform: []
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
      test: {
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
      protractorff: {
        command: 'npm run protractor-test-ff',
        options: {
          stderr: true,
          stdout: true
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
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates'
  });

  grunt.registerTask('checksum', 'Create .md5 checksum file *', function() {
        // Calculate md5 hash
        var fs = require('fs');
        var crypto = require('crypto');
        var md5 = crypto.createHash('md5');
        var glob = require("glob");
        var buffer = "";

        var files = glob.sync("app/**/(*.js|*.html)");

        var buffer = "";
        files.forEach(function (filename) {
            if(filename.indexOf("bower_components") == -1){
              var file = grunt.template.process(filename);
              buffer += fs.readFileSync(file);
            }
        });

        md5.update(buffer);
        var md5Hash = md5.digest('hex');

        grunt.log.writeln('file md5: ' + md5Hash);
 
        // Create new file with the same name with .md5 extension
        var md5FileName = 'app/components/templates/app-checksum.html';
        grunt.file.write(md5FileName, md5Hash);
        grunt.log.write('File "' + md5FileName + '" created.').verbose.write('...').ok();
  });

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'checksum', 'concurrent:dev']);
  grunt.registerTask('test', ['concurrent:test']);
  grunt.registerTask('testff', ['concurrent:testff']);
  grunt.registerTask('build', ['browserify'])

};
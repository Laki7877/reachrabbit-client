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
    uglify: {
      vendor: {
        options: {
          sourceMap: true
        },
        files: {
          'app/dist/vendor.js': [
            "app/bower_components/jquery/dist/jquery.min.js",
            "app/bower_components/bootstrap/dist/js/bootstrap.min.js",
            "app/bower_components/lodash/dist/lodash.js",
            "app/bower_components/angular/angular.js",
            "app/bower_components/angular-scroll-glue/src/scrollglue.js",
            "app/bower_components/ngSmoothScroll/dist/angular-smooth-scroll.min.js",
            "app/bower_components/angular-i18n/angular-locale_th-th.js",
            "app/bower_components/angular-route/angular-route.js",
            "app/bower_components/angular-bootstrap/ui-bootstrap.js",
            "app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
            "app/bower_components/ng-file-upload/ng-file-upload-all.min.js",
            "app/bower_components/angular-sanitize/angular-sanitize.min.js",
            "app/bower_components/satellizer/dist/satellizer.min.js",
            "app/bower_components/jquery-bridget/jquery-bridget.js",
            "app/bower_components/ev-emitter/ev-emitter.js",
            "app/bower_components/desandro-matches-selector/matches-selector.js",
            "app/bower_components/fizzy-ui-utils/utils.js",
            "app/bower_components/get-size/get-size.js",
            "app/bower_components/outlayer/item.js",
            "app/bower_components/outlayer/outlayer.js",
            "app/bower_components/masonry/masonry.js",
            "app/bower_components/imagesloaded/imagesloaded.js",
            "app/bower_components/angular-masonry/angular-masonry.js",
            "app/bower_components/angular-ui-router/release/angular-ui-router.min.js",
            "app/bower_components/moment/moment.js",
            "app/bower_components/moment/locale/th.js",
            "app/bower_components/pica/dist/pica.min.js",
            "app/bower_components/angular-moment/angular-moment.js",
            "app/bower_components/ng-pattern-restrict/src/ng-pattern-restrict.min.js",
            "app/bower_components/json-formatter/dist/json-formatter.min.js",
            "app/bower_components/chart.js/dist/Chart.min.js",
            "app/bower_components/angular-chart.js/dist/angular-chart.min.js",
            "app/bower_components/ng-tags-input/ng-tags-input.js",
            "app/bower_components/sjcl/sjcl.js",
            "app/bower_components/angular-loading-bar/build/loading-bar.min.js"
          ]
        }
      }
    },
    browserify: {
      src: {
        files: {
          'app/dist/bundle.admin.js': ['app/js/admin.js'],
          'app/dist/bundle.influencer.js': ['app/js/influencer.js'],
          'app/dist/bundle.brand.js': ['app/js/brand.js'],
          'app/dist/bundle.portal.js': ['app/js/portal.js']
        },
        options: {
          transform: []
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['shell:autoless', 'shell:server'],
        options: {
          logConcurrentOutput: true
        }
      },
      test: {
        tasks: ['shell:server', 'shell:protractor']
      }
    },
    shell: {
      autoless: {
        command: 'node node_modules/autoless/bin/autoless app/less app/css',
        options: {
          stderr: true
        }
      },
      server: {
        command: 'node server.js',
        options: {
          stderr: true,
          stdout: true
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
        ignores: ['app/bower_components/**/*.js', 'app/js/vendor.js'],
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
    ngtemplates: 'grunt-angular-templates',
    express: 'grunt-express-server'
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
  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('vendor', ['uglify:vendor']);

};
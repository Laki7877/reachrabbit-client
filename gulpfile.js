/**
 * gulp entry point
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

require('dotenv').config();

var browserify      = require('browserify'),
    parcelify       = require('parcelify'),
    buffer          = require('vinyl-buffer'),
    ngannotate      = require('browserify-ngannotate'),
    envify          = require('loose-envify'),
    bulkify         = require('bulkify'),
    merge           = require('merge2'),
    bowerFiles      = require('bower-files')(),
    del             = require('del'),
    glob            = require('glob'),
    gulp            = require('gulp-help')(require('gulp')),
    Server          = require('karma').Server,
    source          = require('vinyl-source-stream'),
    vinylPaths      = require('vinyl-paths'),
    gulpif          = require('gulp-if'),
    _               = require('lodash'),
    args            = require('yargs').argv,
    path            = require('path');

// load all gulp plugins
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/,
  rename: {
    'gulp-minify-css': 'cssmin'
  }
});

// define file path variables
var paths = {
  root: 'app/',      // App root path
  dist: {
    root: 'public/assets/',
    js: 'public/assets/js/',
    css: 'public/assets/css/'
  },
  src: {
    sass: 'app/styles/**/*.scss',
    css: 'app/styles/**/*.css',
    html: 'app/**/*.html',
    vendor: 'app/vendor.js',
    app: 'app/app.js'
  },
  test: 'test/'      // Test path
};

var liveReload = true;

/*******************************************
 * Test
 *******************************************/

// all test
gulp.task('test', 'Run all test', ['test:unit', 'test:e2e', 'test:browser']);

// unit test (mocha)
gulp.task('test:unit', 'Run unit test', function () {
  return gulp.src([
    paths.test + 'unit/**/*.js'
  ])
  .pipe(plugins.mocha({reporter: 'dot'}));
});

// e2e test (protactor)
gulp.task('test:e2e', 'Run E2E test', ['server'], function () {
  return gulp.src([paths.test + 'e2e/**/*.js'])
  .pipe(plugins.protractor.protractor({
    configFile: 'protractor.conf.js',
    args: ['--baseUrl', 'http://127.0.0.1:8080'],
  }))
  .on('error', function (e) {
    throw e;
  })
  .on('end', function () {
    plugins.connect.serverClose();
  });
});

// browser test (karma)
gulp.task('test:browser', 'Run karma test', ['browserify:test'], function (done) {
  new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
  }, done).start();
});

/***********************************************
 * Build
 ***********************************************/
// build all modules
gulp.task('build:all', 'Build all modules (core and vendors)', ['build:vendor', 'build']);

// build core (css, js, etc.)
gulp.task('build', 'Build core modules', ['build:templates', 'build:styles', 'build:scripts']);

// bundle app.js
gulp.task('build:scripts', 'Bundle scripts from src', function () {
  return browserify(paths.src.app, {
    debug: true,
    transform: [ngannotate, envify, bulkify]
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(plugins.sourcemaps.init({loadMaps: true}))
  .pipe(plugins.uglify())
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.dist.js));
}, {
  aliases: ['b', 'B'],
   options: {
    'min': 'Apply minify'
  }
});

gulp.task('build:templates', 'Build angular templates', function() {
  return gulp.src(paths.src.html)
    .pipe(plugins.minifyHtml({
      quotes: true
    }))
    .pipe(plugins.angularTemplatecache('templates.js', {
      module: 'ng',
      transformUrl: function(url) {
        var x = url.split('\\');
        x.splice(0, 2);
        return x.join('\\');
      }
    }))
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.js));
});

// compile custom scss and css to app.css
gulp.task('build:styles', 'Build styles from src', function() {
  return merge(
    gulp.src(paths.src.css),
    gulp.src(paths.src.sass).pipe(plugins.sass().on('error', plugins.sass.logError))
  )
  .pipe(plugins.concat('app.css'))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.autoprefixer())
  .pipe(plugins.cssmin())
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest(paths.dist.css));
});

gulp.task('build:vendor', 'Build vendor lib', ['build:vendor:styles', 'build:vendor:scripts']);

// compile 3rd party npm packages
gulp.task('build:vendor:scripts', 'Build scripts from npm', function(done) {
  var vendorScriptPath = paths.src.vendor;

  // browserify
  var b = browserify(vendorScriptPath, { debug: false });
  return b.bundle()
    .on('error', done)
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.js));
});

// compile bower styles
gulp.task('build:vendor:styles', 'Build styles from bower', function(done) {
  var rebaseOpts = {
    copyFiles: {
      publicPath: '../',
      filePath: paths.dist.root,
      fileTypes: [
          {
              test: /\.(png|jpg|gif)$/,
              folder: 'img'
          },
          {
              test: /\.(woff|woff2|eot|ttf|svg)(\?.*?|)$/,
              folder: 'fonts'
          }
      ]
    }
  };
  // compile 3rd party bower styles
  return merge(
      gulp.src(bowerFiles.ext('css').files),
      gulp.src(bowerFiles.ext('scss').files).pipe(plugins.sass())
    )
    .pipe(plugins.cssUrlRebase(rebaseOpts))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('vendor.css'))
    .pipe(plugins.cssmin())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css));
});

// compile app.js to test.js for karma test
gulp.task('build:test', 'Build all js to test.js', function () {
  //bundle browserify
  var bundler = browserify({
      debug: true,
      transform: [ngannotate, envify, bulkify]
    });
  // add all unit tests
  glob.sync(paths.test + 'unit/**/*.js')
  .forEach(function (file) {
    bundler.add(file);
  });

  //output to test.js
  return bundler
  .bundle()
  .pipe(source('test.js'))
  .pipe(gulp.dest(paths.test + 'browser'));
});

/***************************************************
 * Application
 ***************************************************/

// start http server
gulp.task('server', 'Start application on httpserver', ['browserify'], function () {
    plugins.connect.server({
      root: 'app',
      livereload: liveReload,
    });
  }, {
    aliases: ['start']
});

// watch js and sass
gulp.task('watch', 'Watch and compile js and scss on change', function () {
  gulp.start('server');
  gulp.watch([paths.src + '**/*.js'], ['browserify']);
  gulp.watch([paths.src + '/sass/**/*.scss'], ['sass']);
});

// bump version
gulp.task('bump', 'Update repository semver version (X.X.X)', function() {
  // should only be either of these values
  // otherwise, default to "patch"
  var version = _.includes(['patch', 'minor', 'major', 'prerelease'], args.version) ? args.version : 'patch';

  return gulp.src('./package.json')
    .pipe(plugins.bump({type: version}))
    .pipe(gulp.dest('./'));
}, {
  options: {
    version: 'One of bump version type (minor, major, patch, prerelease). default: patch'
  }
});

// clean
gulp.task('clean', 'Clean distribution files', function () {
  return gulp
  .src([paths.dist.root], {read: false})
  .pipe(vinylPaths(del));
});

// lint
gulp.task('lint', 'Lint all client js', function () {
  return gulp
  .src(['gulpfile.js',
      paths.root + '**/*.js',
      paths.test + '**/*.js',
      '!' + paths.test + 'browser/**',
  ])
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter(require('jshint-stylish')));
});


// default
gulp.task('default', 'Run build', ['build']);

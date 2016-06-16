/**
 * gulp entry point
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

require('dotenv').config();

var browserify = require('browserify'),
    parcelify = require('parcelify'),
    ngannotate = require('browserify-ngannotate'),
    envify = require('loose-envify'),
    merge = require('merge2'),
    del = require('del'),
    glob = require('glob'),
    gulp = require('gulp-help')(require('gulp')),
    Server = require('karma').Server,
    source = require('vinyl-source-stream'),
    vinylPaths = require('vinyl-paths'),
    gulpif = require('gulp-if'),
    _ = require('lodash'),
    args = require('yargs').argv,
    path = require('path');

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
  src:  'app/js/',   // Source path
  dist: 'app/dist/', // Distribution path
  sass: 'app/sass/**/*.scss', // Sass path
  css:  'app/css/**/*.css',  // Css path
  test: 'test/'      // Test path
};

var liveReload = true;

// clean
gulp.task('clean', 'Clean distribution files', function () {
  return gulp
  .src([paths.dist], {read: false})
  .pipe(vinylPaths(del));
});

// lint
gulp.task('lint', 'Lint all client js', function () {
  return gulp
  .src(['gulpfile.js',
      paths.src + '**/*.js',
      paths.test + '**/*.js',
      '!' + paths.test + 'browser/**',
  ])
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter(require('jshint-stylish')));
});

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

// build all stuffs (css, js, etc.)
gulp.task('build:all', 'Bundle ', ['build:vendor', 'build:css', 'build']);

// bundle app.js
gulp.task('build', 'Bundle app.js', function () {
  return browserify(paths.src + 'app.js', {
    debug: true,
    transform: [ngannotate, envify]
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulpif(args.min, plugins.streamify(plugins.uglify())))
  .pipe(gulp.dest(paths.dist))
  .pipe(plugins.connect.reload());
  }, {
    aliases: ['b', 'B'],
    options: {
      'min': 'Apply minify'
    }
});

// compile custom scss and css to app.css
gulp.task('build:css', 'Build sass to css', function() {
  return merge(
    gulp.src(paths.sass).pipe(plugins.sass().on('error', plugins.sass.logError)),
    gulp.src(paths.css)
  )
  .pipe(plugins.concat('app.css'))
  //.pipe(plugins.sourcemaps.init())
  .pipe(plugins.autoprefixer())
  .pipe(plugins.cssmin())
  //.pipe(plugins.sourcemaps.write())
  .pipe(gulp.dest(paths.dist));
});

// compile js and css third party library to vendor.css/.js
gulp.task('build:vendor', 'Build all vendor library', function(done) {
  var vendorScriptPath = path.join(paths.src, 'vendor.js');
  var vendorStylePath = path.join(paths.dist, 'vendor.css');

  //compile js
  var b = browserify(vendorScriptPath, {
    debug: false,
  });

  //compile css
  var p = parcelify(b, {
    bundles: {
      style: vendorStylePath,
    }
  }).on('bundleWritten', function() {
    //apply autoprefix and cssmin to result
    return gulp.src(vendorStylePath, {base: './'})
      .on('error', done)
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cssmin())
      .pipe(gulp.dest('./'));
  });

  //bundling browserify
  return b.bundle()
    .on('error', done)
    .pipe(source('vendor.js'))
    .pipe(plugins.streamify(plugins.uglify()))
    .pipe(gulp.dest(paths.dist));
});

// compile app.js to test.js for karma test
gulp.task('browserify:test', 'Browserify all js to test.js', function () {
  //bundle browserify
  var bundler = browserify({
      debug: true,
      transform: [ngannotate, envify]
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

// bump versioning
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

// default
gulp.task('default', 'Run build', ['build']);

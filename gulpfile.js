/**
 * gulp entry point
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

require('dotenv').config();

var browserify = require('browserify'),
    ngannotate = require('browserify-ngannotate'),
    envify = require('loose-envify'),
    del = require('del'),
    glob = require('glob'),
    gulp = require('gulp-help')(require('gulp')),
    Server = require('karma').Server,
    source = require('vinyl-source-stream'),
    vinylPaths = require('vinyl-paths'),
    gulpif = require('gulp-if'),
    _ = require('lodash'),
    args = require('yargs').argv;

// load all gulp plugins
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

// define file path variables
var paths = {
  root: 'app/',      // App root path
  src:  'app/js/',   // Source path
  dist: 'app/dist/', // Distribution path
  sass: 'app/sass/', // Sass path
  css:  'app/css/',  // Css path
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
gulp.task('test', 'Run all test', ['test:unit', 'test:e2e', 'test:browserify']);

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

// browserify to app.js
gulp.task('browserify', 'Browserify all js to app.js', function () {
  return browserify(paths.src + 'app.js', {
    debug: true,
    transform: [ngannotate, envify]
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest(paths.dist))
  .pipe(gulpif(args.min, plugins.streamify(plugins.uglify())))
  .pipe(plugins.connect.reload());
}, {
  aliases: ['b', 'B'],
  options: {
    'min': 'Apply minify'
  }
});

// browserify to test.js for karma
gulp.task('browserify:test', 'Browserify all js to test.js', function () {
//  console.log(process.env);
  var bundler = browserify({
      debug: true,
      transform: [ngannotate, envify]
    });
  glob
  .sync(paths.test + 'unit/**/*.js')
  .forEach(function (file) {
    bundler.add(file);
  });
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

// compile sass to css
gulp.task('sass', 'Compile app.scss to app.css', function() {
  return gulp.src(paths.sass + 'app.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(paths.css));
})

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
})

// default
gulp.task('default', 'Run browserify task on default', ['fast']);

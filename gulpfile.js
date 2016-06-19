/**
 * gulp entry point
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

require('dotenv').config();

var _               = require('lodash'),
    browserify      = require('browserify'),
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
    guppy           = require('git-guppy')(gulp),
    Server          = require('karma').Server,
    source          = require('vinyl-source-stream'),
    vinylPaths      = require('vinyl-paths'),
    gulpif          = require('gulp-if'),
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
    root: 'app/',
    sass: 'app/styles/**/*.scss',
    css: ['app/styles/**/*.css', 'app/components/**/*.css'],
    html: 'app/**/*.html',
    vendor: 'app/vendor.js',
    app: 'app/app.js'
  },
  tmp: {
    root: 'tmp/',
    app: 'tmp/app.js'
  },
  test: 'test/'      // Test path
};

var liveReload = true;

/***************************************************
 * Git hook
 ***************************************************/

// git precommit
gulp.task('pre-commit', 'Git hook pre-commit', ['lint']);

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
gulp.task('build', 'Build core modules', ['build:styles', 'build:scripts']);


// build core js
gulp.task('build:scripts', 'Build core scripts with browserify', ['build:clean:scripts']);

  // process scripts to tmp
  gulp.task('build:tmp:scripts', false, function() {
    return gulp.src(path.resolve(paths.src.root, '**/*'))
      /*.pipe(plugins.angularEmbedTemplates({
        minimize: require('minimize')
      }))*/
      .pipe(gulp.dest(paths.tmp.root));
  });

  // bundle tmp/app.js
  gulp.task('build:bundle:scripts', false, ['build:tmp:scripts'], function () {
    var b = browserify(paths.tmp.app, {
      debug: true,
      transform: [ngannotate, envify, bulkify]
    });

    require('./lib/poonify')(b, {
      output: path.resolve(paths.dist.js, 'template.js'),
      excludes: ['app']
    });

    return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.js));
  });

  // clean tmp folder
  gulp.task('build:clean:scripts', false, ['build:bundle:scripts'], function() {
    return gulp.src([paths.tmp.root], {read: false})
    .pipe(vinylPaths(del));
  });

/* depreciated
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
});*/

// build custom scss and css
gulp.task('build:styles', 'Build core styles', function() {
  return merge(
    gulp.src(paths.src.css[0]),
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

// build 3rd party vendor
gulp.task('build:vendor:scripts', 'Build scripts from npm vendor', function(done) {
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

// build 3rd party bower styles
gulp.task('build:vendor:styles', 'Build styles from bower vendor', function(done) {
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
      gulp.src(bowerFiles.ext('less').files).pipe(plugins.less()),
      gulp.src(bowerFiles.ext('scss').files).pipe(plugins.sass())
    )
    .pipe(plugins.cssUrlRebase(rebaseOpts))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('vendor.css'))
    .pipe(plugins.cssmin())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css));
});

// build js for test
gulp.task('build:test', 'Build all js to test.js', function () {
  //bundle browserify
  var bundler = browserify({
      debug: false,
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
gulp.task('server', 'Start express server', function () {
    var server = plugins.liveServer.new('app.js');
    server.start();

    // notify server for livereload
    gulp.watch([path.resolve(__dirname, 'public/asset/**/*')], function(file) {
      server.start.bind(server)();
    });
  }, {
    aliases: ['start', 'run', 'serve']
});

gulp.task('server:test', 'Start test server', function() {
  return plugins.connect.server({
    root: 'public',
    livereload: true
  });
});

// watch js and sass
gulp.task('watch', 'Watch and compile js and scss on change', function () {
  gulp.start('server');
  gulp.watch([paths.src.root + '**/*'], ['build']);
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
        paths.src.root + '**/*.js',
        paths.test + '**/*.js',
        '!' + paths.test + 'browser/**'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(require('jshint-stylish')));
});

// default
gulp.task('default', 'Run build', ['build']);

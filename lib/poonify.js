/**
 * Create angular template cache with correct package into one file
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
var util = require('util');
var through = require('through2');
var render = require('ng-templatecache');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Minimize = require('minimize'),
    minimize = new Minimize();

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (directoryExists(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  }
  catch (err) {
    return false;
  }
}

// use with angular-css
function rebasify(b, options) {
  var _this = this;

  if( ! ( this instanceof rebasify ) ) return new rebasify( b, options );
 
  var regex = /css\s*:\s*(?:(?:\[)\s*([\w'"\s,\\\/\.]*)(?:\])|(?:([\w'"\s\\\/\.]*)))/g;
  var data = [];

  options = options || {};
  options = _.defaults(options, {
    workingDir: 'tmp',
    baseDir: '../css/'
  });

  b.pipeline.get('json').push(through.obj(function(f, e, next) {
    var p = path.dirname(f.file);

    f.source = f.source.replace(regex, function(m, p1, p2) {
      var context = p1 || p2;
      context = context.split(',');
      context = _.map(context, function(c) {
        c = _.trim(c); // get rid of spaces
        var quot = c[0];
        c = c.substring(1, c.length-1); // get rid of quotation
        c = path.resolve(p, c); //find absolute path
        c = path.join(options.baseDir, path.relative(path.resolve(process.cwd(), options.workingDir), c)).split(path.sep).join('/');

        // use .css only
        if(path.extname(c) !== '.css') {
          c += '.css';
        }

        c = quot + c + quot;
        return c;
      });
      if(context.length > 1) {
        context = '[' + context.join(',') + ']';
      } else {
        context = context.join(',');
      }
      return 'css:' + context;
    });

    next(null, f);
  }));

  return _this;
}

// use with angular modules
function templatify(b, options) {
  var _this = this;

  if( ! ( this instanceof templatify ) ) return new templatify( b, options );

  var regex = /angular\s*\.module\s*\(\s*(?:\'|\")([\w\s.]*)(?:\'|\")\s*,\s*\[[\w\W]*\]\s*\)/g;
  var data = [];

  // default options
  options = options || {}
  options = _.defaults(options, {
    output: 'templates.js',
    excludes: ['app']
  });

  b.pipeline.get('json').push(through.obj(function(f, e, next) {
    var p = path.dirname(f.file);
    var match = regex.exec(f.source);

    if(match !== null) {
      // filter excludes
      if(_.findIndex(options.excludes, function(o) { return o === match[1]}) < 0) {
        data.push({
          name: match[1],
          path: p
        });
      }
    }
    next(null, f);
  }));
  b.on('bundle', function(bundle) {
    bundle.on('end', function() {
      var cache = '';
      _.forEach(data, function(e) {
        var files = glob.sync(path.relative(process.cwd(), path.join(e.path, '/**/*.html')));
        var renderOpts = { entries: [], module: e.name };

        _.forEach(files, function(f) {
          var buf = fs.readFileSync(f, 'utf-8'); //read html
          renderOpts.entries.push({
            content: minimize.parse(buf),
            path: path.relative(e.path, f)
          });
        });

        cache += render(renderOpts);
      });
      ensureDirectoryExistence(options.output);
      fs.writeFileSync(options.output, cache, { flag: 'w+', encoding: 'utf-8' });
    });
  });

  return _this;
}

util.inherits(rebasify, EventEmitter);
util.inherits(templatify, EventEmitter);

module.exports = {
  rebasify: rebasify,
  templatify: templatify
};
/**
 * Create angular template cache with correct package into one file
 * TODO: concat css scope to cache?
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
var inherits = require('inherits');
var through = require('through2');
var render = require('ng-templatecache');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var Minimize = require('minimize'),
    minimize = new Minimize();

function Poonify(b, options) {
  var _this = this;
  var regex = /angular\s*\.module\s*\(\s*(?:\'|\")([\w\s.]*)(?:\'|\")\s*,\s*\[[\w\W]*\]\s*\)/g;
  var data = [];

  // default options
  options = options || {}
  options = _.defaults(options, {
    output: 'templates.js',
    excludes: ['app']
  });

  b.pipeline.get('json').push(through.obj(function(f, e, next) {
    var path = f.file;
    var match = regex.exec(f.source);

    if(match !== null) {
      // remove last
      var u = path.split('\\');
      u.pop();
      path = u.join('\\');

      // filter excludes
      if(_.findIndex(options.excludes, function(o) { return o === match[1]}) < 0) {
        data.push({
          name: match[1],
          path: path
        });
      }
    }
    next();
  }));
  b.on('bundle', function(bundle) {
    bundle.on('end', function() {
      var cache = '';
      _.forEach(data, function(e) {
        var files = glob.sync(path.relative(process.cwd(), e.path + '\\**\\*.html'));
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
      fs.writeFileSync(options.output, cache, { flag: 'w+', encoding: 'utf-8' });
    });
  });
}

module.exports = Poonify;

/**
 * common components
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  'ngSanitize',
	'ui.router',
	'angularCSS',
	'satellizer',
  'ngFileUpload',
  'ngMaterial',
  require('../mdForm')
];

angular.module('app.common', components);

var bulk = require('bulk-require');
bulk(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.common';
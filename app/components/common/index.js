'use strict';

angular.module('app.common', ['angularCSS', 'ui.router']);

var bulk = require('bulk-require');
bulk(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.common';

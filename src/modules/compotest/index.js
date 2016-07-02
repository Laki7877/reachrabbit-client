/**
 * Compotest module
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  require('../../components/common'),
  require('../../components/mdForm')
];

angular.module('app.compotest', components)
  .config(function($stateProvider) {
    $stateProvider
      .state('compotest', {
        url: '/',
        controller: 'compotestController',
        templateUrl: 'index.html'
      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.compotest';

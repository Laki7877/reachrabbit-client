/**
 * Landing page
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

// component module
angular.module('app.landing', ['ui.router'])
  .config(function($stateProvider) {
    // create landing page state
    $stateProvider.state('landing', {
      controller: 'LandingController',
      templateUrl: 'landing.html'
    });
  });

// import all subcomponents
require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

// module export
module.exports = 'app.landing';

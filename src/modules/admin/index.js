/**
 * Admin module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
 */
'use strict';

var components = [
  require('../../components/common')
];

app.module('app.admin', components)
  .config(function($stateProvider) {
    /**
     * Main Layout
     */
    $stateProvider
      .state('main', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'abstract/main-brand.html'
          }
        }
      });
  });

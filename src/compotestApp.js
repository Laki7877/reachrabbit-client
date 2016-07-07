/**
 * Component Test app
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  require('./modules/compotest')
];

angular.module('app', components)
  .run(function($state) {
  });

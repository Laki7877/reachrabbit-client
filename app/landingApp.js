/**
 * Landing app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./components/common'),
	require('./modules/landing')
];

angular.module('app', components)
  .run(function($state) {
    $state.go('brand');
  });

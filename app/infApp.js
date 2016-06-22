/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/inf')
];

angular.module('app', components)
  .run(function($state) {
  });

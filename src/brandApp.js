/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
 */
'use strict';

var components = [
	require('./modules/brand')
];

angular.module('app', components)
  .run(function($state, $rootScope, $storage) {
    $state.go('campaign-list');
  });

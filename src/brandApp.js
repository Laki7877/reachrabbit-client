/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/brand')
];

angular.module('app', components)
  .run(function($state, $json, $rootScope) {
      $rootScope.getRouteByStatus = function(card){
        if(card.status == 'payment pending' ||
         card.status == 'wait for payment' ||
          card.status == 'wait for confirm'){
          return 'open';
        }
        return card.status.toLowerCase();
      }
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
       console.error('Router change error', event, toState, toParams, fromState, error);
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
       console.log('Router change success', event, toState, toParams, fromState, error);
      });
  });

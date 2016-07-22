/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/influencer')
];

angular.module('app', components)
  .run(function($state, $json, $rootScope) {
      $rootScope.getRouteByStatus = function(card){
        if(card.status == 'payment pending' ||
          card.status == 'wait for payment' ||
          card.status == 'wait for confirm'){
          return 'open';
        }
        return (card.status || '').toLowerCase();
      }

      $rootScope.getRouteByStatusApplied = function(card){
        if(card.status == 'payment pending' ||
          card.status == 'wait for payment' ||
          card.status == 'wait for confirm'){
          return 'applied';
        }
        return (card.status || '').toLowerCase();
      }
  });

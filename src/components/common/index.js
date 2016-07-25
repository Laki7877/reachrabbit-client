/**
 * common components
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  'ngSanitize',
	'ui.router',
	'angularCSS',
	'satellizer',
  'ngFileUpload',
  'ui.bootstrap',
  'angular-loading-bar'
];

angular.module('app.common', components)
.controller('errorController', function($scope, $state){
  console.log($state.params);
  $scope.code = $state.params.code;
  $scope.description = $state.params.description;
})
.run(function($json, $rootScope, $storage) {

      $rootScope.getProfile = function(){
        return $storage.get('profile');
      }

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
          card.status == 'wait for payment' || card.status == 'open' ||
          card.status == 'wait for confirm'){
          return 'applied';
        }
        return (card.status || '').toLowerCase();
      }

      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
       console.error('Router change error', event, toState, toParams, fromState, error);
       $state.go('error', { 'code': 0, 'description':  error})
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
       console.log('Router change success', event, toState, toParams, fromState, error);
       $state.go('error', { 'code': 0, 'description':  error})
      });


  });


var bulk = require('bulk-require');
bulk(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.common';

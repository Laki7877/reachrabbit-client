/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.controller',
  'myApp.view',
  'myApp.directives'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('');
  $routeProvider.otherwise({redirectTo: '/404'});
}]).
run(['$rootScope', '$location', function($rootScope, $location){
  $rootScope.goTo = function(path){
    $location.path(path);
  };
}]);
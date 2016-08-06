/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'angular-loading-bar',
  'ui.bootstrap',
  'ngFileUpload',
  'ngTagsInput',
  //Top level
  'myApp.directives',
  'myApp.routes',
  'myApp.controller',
  //Controllers
  'myApp.portal.controller',
  'myApp.brand.controller',
  //Routes
  'myApp.portal.routes',
  'myApp.brand.routes'
]).
config(['$locationProvider', '$routeProvider','cfpLoadingBarProvider', function($locationProvider, $routeProvider, cfpLoadingBarProvider) {
  // $locationProvider.hashPrefix('');
  $routeProvider.otherwise({redirectTo: '/404'});
  cfpLoadingBarProvider.includeSpinner = false;

}]).
run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
  $rootScope.goTo = function(path){
    $location.path(path);
  };

  $rootScope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $rootScope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $rootScope.format = $rootScope.formats[0];

  $rootScope.getProfile = function(){
   return JSON.parse($window.localStorage.profile);
  };

}]);

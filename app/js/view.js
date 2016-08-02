'use strict';

angular.module('myApp.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/404', {
    templateUrl: 'view/404.html',
    controller: 'EmptyController'
  });

  $routeProvider.when('/brand-login', {
    templateUrl: 'view/brand-login.html',
    controller: 'EmptyController'
  });

  $routeProvider.when('/brand-signup', {
    templateUrl: 'view/brand-signup.html',
    controller: 'EmptyController'
  });

  $routeProvider.when('/brand-campaign-list', {
    templateUrl: 'view/brand-campaign-list.html',
    controller: 'EmptyController'
  });

}]);
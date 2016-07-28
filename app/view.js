'use strict';

angular.module('myApp.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'view/login.html',
    controller: 'EmptyController'
  });

  $routeProvider.when('/view2', {
    templateUrl: 'view/view2.html',
    controller: 'EmptyController'
  });

  $routeProvider.when('/viewx', {
    templateUrl: 'view/viewx.html',
    controller: 'EmptyController'
  });

}])

.controller('EmptyController', [function() {

}]);

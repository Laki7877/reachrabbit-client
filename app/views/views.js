'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'views/view2.html',
    controller: 'EmptyController'
  });

  $routeProvider.when('/viewx', {
    templateUrl: 'views/viewx.html',
    controller: 'EmptyController'
  });



}])

.controller('EmptyController', [function() {

}]);

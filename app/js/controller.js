'use strict';

angular.module('myApp.controller', [])
.controller('EmptyController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    }
}]);

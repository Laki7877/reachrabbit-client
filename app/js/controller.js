'use strict';

angular.module('myApp.controller', ['myApp.service'])
.controller('EmptyController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    }
}])
/*
* Brand sign in controller - for brand to signin duh
*/
.controller('BrandSigninController', ['$scope', 'BrandAccountService', function($scope, BrandAccountService) {
    $scope.formData = {};
    $scope.login = function(username, password){
        BrandAccountService.getToken(username, password)
        .then(function(response){
            var token = response.data.token;
            alert("Done" + token);
        });
    }
}])
.controller('BrandSignupController', ['$scope', 'BrandAccountService', function($scope, BrandAccountService) {
    $scope.formData = {};
    $scope.submit = function(brand){
        BrandAccountService.signup(brand)
        .then(function(response){
            alert("Done");
        });
    }
}]);

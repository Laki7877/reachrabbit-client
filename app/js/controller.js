'use strict';

angular.module('myApp.controller', ['myApp.service'])
.controller('EmptyController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    }
}])
.controller('BrandLoginController', ['$scope', function($scope) {
    
}])
.controller('BrandSignupController', ['$scope', 'SignUpService', function($scope, SignUpService) {
    $scope.formData = {};
    $scope.submit = function(brand){
        SignUpService.signupBrand(brand)
        .then(function(){
            alert("Done");
        });
    }
}]);

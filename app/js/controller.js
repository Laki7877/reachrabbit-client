'use strict';

angular.module('myApp.controller', ['myApp.service'])
.controller('EmptyController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    }
    $scope.myCampaign=[
      {
        image:'images/placeholder-campaign.png',
        name:'Campaign แรกของคุณ',
        price:'-',
        openDate:'-',
        category:'-',
        buttonText:'ใส่รายละเอียด'
      },
      {
        image:'images/placeholder-campaign.png',
        name:'cat',
        price:'500-1,000',
        openDate:'1 ธ.ค. 59',
        category:'เกมส์',
        buttonText:'ใส่รายละเอียด'
      }
    ]
    $scope.exampleCampaign=[
      {
        image:'images/example-campaign/main-picture.png',
        name:'Morinaga Koeda รสใหม่',
        price:'200-2,000',
        openDate:'1 ธ.ค. 59',
        category:'ความสวยงาน',
        buttonText:'ดูรายละเอียด'
      },
      {
        image:'images/example-campaign/main-picture.png',
        name:'Morinaga Koeda รสใหม่',
        price:'500-1,000',
        openDate:'1 ธ.ค. 59',
        category:'เกมส์',
        buttonText:'ดูรายละเอียด'
      }
    ]
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


/*
* Camapign controller - for Campaign ok
*/

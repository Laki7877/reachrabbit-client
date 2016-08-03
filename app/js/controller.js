/**
 * Controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

angular.module('myApp.controller', ['myApp.service'])
.controller('EmptyController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    };
}])
/*
* Campaign List controller - thank god it's work.
*/
.controller('CampaignListController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    };

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
        name:'Super Cat',
        price:'500-1,000',
        openDate:'1 ธ.ค. 59',
        category:'เกมส์',
        buttonText:'ใส่รายละเอียด'
      }
    ];

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
    ];
}])
/*
* Brand sign in controller - for brand to signin duh
*/
.controller('BrandSigninController', ['$scope', '$location', 'BrandAccountService', '$window', function($scope, $location, BrandAccountService, $window) {
    $scope.formData = {};
    $window.localStorage.removeItem('token');
    $scope.login = function(username, password){
        BrandAccountService.getToken(username, password)
        .then(function(response){
            var token = response.data.token;
            $window.localStorage.token = token;
            $window.location.href = '/brand.html#/brand-campaign-list';
        });
    };
}])
.controller('BrandSignupController', ['$scope', 'BrandAccountService', '$location', function($scope, BrandAccountService, $location) {
    $scope.formData = {};
    $scope.submit = function(brand){
        BrandAccountService.signup(brand)
        .then(function(response){
            $location.path('/brand-login');
        });
    }
}]);

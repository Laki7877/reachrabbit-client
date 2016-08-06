/**
 * Controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

/////////////// /////////////// /////////////// ///////////////

angular.module('myApp.controller', ['myApp.service'])
.controller('EmptyController', ['$scope', function($scope) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    };
}]);


/////////////// /////////////// /////////////// /////////////// /////////////// ///////////////

angular.module('myApp.brand.controller', ['myApp.service'])
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
        buttonText:'ใส่รายละเอียด',
        linkTo:'brand-campaign-detail-draft'
      },
      {
        image:'images/placeholder-campaign.png',
        name:'Super Cat',
        price:'500-1,000',
        openDate:'1 ธ.ค. 59',
        category:'เกมส์',
        buttonText:'ใส่รายละเอียด',
        linkTo:'brand-campaign-detail-draft'
      }
    ];

    $scope.exampleCampaign=[
      {
        image:'images/example-campaign/main-picture.png',
        name:'Morinaga Koeda รสใหม่',
        price:'200-2,000',
        openDate:'1 ธ.ค. 59',
        category:'ความสวยงาน',
        buttonText:'ดูรายละเอียด',
        linkTo:'brand-campaign-detail-example'
      },
      {
        image:'images/example-campaign/main-picture.png',
        name:'Morinaga Koeda รสใหม่',
        price:'500-1,000',
        openDate:'1 ธ.ค. 59',
        category:'เกมส์',
        buttonText:'ดูรายละเอียด',
        linkTo:'brand-campaign-detail-example'
      }
    ];
}])
.controller('CampaignDetailController', ['$scope', function($scope) {

    $scope.exampleCampaign=
    {
      image:'images/example-campaign/main-picture.png',
      name:'Morinaga Koeda รสใหม่',
      price:'1,000-2,500',
      openUntilDate:'25 ธ.ค. 58',
      brand:'Morinaga',
      category:'ความงาม'
    };
    $scope.emptyCampaign=
    {
      image:'images/placeholder-campaign.png',
      name:'Campaign แรกของฉัน',
      price:'-',
      openUntilDate:'-',
      brand:'-',
      category:'-'
    };
}])
.controller('BrandProfileController', ['$scope', '$window', 'AccountService', '$location', function($scope, $window, AccountService, $location) {
    $scope.formData = {};
    AccountService.getProfile()
    .then(function(response){
        $scope.formData = response.data;
    });
}]);
/////////////// /////////////// /////////////// /////////////// ///////////////
angular.module('myApp.portal.controller', ['myApp.service'])
.controller('BrandSigninController', ['$scope', '$location', 'AccountService', '$window', function($scope, $location, AccountService, $window) {
    $scope.formData = {};
    $window.localStorage.removeItem('token');
    $scope.login = function(username, password){
        AccountService.getToken(username, password)
        .then(function(response){
            var token = response.data.token;
            $window.localStorage.token = token;
            return AccountService.getProfile();
        })
        .then(function(profileResp){
            $window.localStorage.profile = JSON.stringify(profileResp.data);
            $window.location.href = '/brand.html#/brand-campaign-list';
        })
        .catch(function(data){
            $scope.error = true;
        });
    };
}])
.controller('BrandSignupController', ['$scope', 'BrandAccountService', '$location', '$window', function($scope, BrandAccountService, $location, $window) {
    $scope.formData = {};
    $scope.submit = function(brand){
        $window.localStorage.removeItem('token');
        BrandAccountService.signup(brand)
        .then(function(response){
            $location.path('/brand-login');
        });
    };
}]);
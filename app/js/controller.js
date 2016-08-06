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
.controller('CampaignListController', ['$scope', 'CampaignService', function($scope, CampaignService) {
    $scope.testHit = function(){
        var scope = $scope;
        console.log("Test World");
    };
    $scope.myCampaign = [];
    
    CampaignService.getAll().then(function(response){
        $scope.myCampaign = response.data;
    });


    $scope.exampleCampaign=[
      {
        resources: [{
            url: 'images/example-campaign/main-picture.png'
        }],
        title:'Morinaga Koeda รสใหม่',
        price:'200-2,000',
        proposalDeadline:'1 ธ.ค. 59',
        category: { categoryName: 'ความสวยแมว'},
        buttonText:'ดูรายละเอียด',
        linkTo:'brand-campaign-detail-example'
      },
      {
        resources: [{
            url: 'images/example-campaign/main-picture.png'
        }],
        title:'Morinaga Koeda รสใหม่',
        price:'500-1,000',
        proposalDeadline:'1 ธ.ค. 59',
        category: {categoryName: 'เกมส์'},
        buttonText:'ดูรายละเอียด',
        linkTo:'brand-campaign-detail-example'
      }
    ];
}])
.controller('CampaignDetailController', ['$scope','$routeParams', 'CampaignService', 'DataService', '$filter', '$anchorScroll', '$location', 
function($scope, $routeParams, CampaignService, DataService, $filter, $anchorScroll, $location) {
    //initial form data
    $scope.formData = {
        categoryId: {
            categoryId: 0,
            categoryName: "-- เลือกหมวดหมู่ --"
        },
        resources : []
    };
    $scope.states = {
        IDLE : 0,
        SAVE_DRAFT_OK:1,
        SAVE_DRAFT_FAIL_VAL: 2,
        SAVE_PUB_OK: 3,
        SAVE_PUB_FAIL_VAL: 4,
        ERROR: 5
    };
    $scope.state = $scope.states.IDLE;
    $scope.mediaBooleanDict = {};
    $scope.mediaObjectDict = {};
    $scope.categories  = [];
    $scope.budgets = [{
        id: 1,
        toBudget: 1000,
        fromBudget: 500
    },{
        id: 2,
        toBudget: 5000,
        fromBudget: 1000
    },{
        id: 3,
        toBudget: 10000,
        fromBudget: 5000
    }];

    $scope.budget = {
        id: 0,
        fromBudget: "-- เลือกค่าตอบแทน -",
        toBudget: ""
    };

    $scope.budgetDisplayAs = function(budgetObject){
        return $filter('number')(budgetObject.fromBudget) + " - " + $filter('number')(budgetObject.toBudget);
    };

    //Fetch initial datasets
    DataService.getMedium()
    .then(function(response){
        $scope.medium = response.data; 
        $scope.medium.forEach(function(item){
            $scope.mediaObjectDict[item.mediaId] = item;
        });
    });
    DataService.getCategories()
    .then(function(response){
        $scope.categories = response.data;
        $scope.categories.unshift({
            categoryId: 0,
            categoryName: "-- เลือกหมวดหมู่ --"
        });
    });

    var campaignId = $routeParams.campaignId;
    if(campaignId){
        //If there is a campaign id in params
        //we are in edit mode
        CampaignService.getOne(campaignId)
        .then(function(response){
            //overrides the form data
            $scope.formData = response.data;
            //Tell checkbox which media are in the array
            $scope.formData.media.forEach(function(item){
                $scope.mediaBooleanDict[item.mediaId] = true;
            });
            //Tell dropdown which budget is matching the budget object
            $scope.budget =  _.find($scope.budgets, function(probe){
                return Number(probe.fromBudget) === Number($scope.formData.fromBudget) &&
                Number(probe.toBudget) === Number($scope.formData.toBudget);
            });
        });
    }
    
    $scope.$watch('mediaBooleanDict', function(){
        $scope.formData.media = [];
        //tell server which media are checked
        _.forEach($scope.mediaBooleanDict, function(value, key) {
            if(value===true){
                $scope.formData.media.push($scope.mediaObjectDict[key]);
            }
        });
        
    }, true);

    $scope.$watch('budget.id', function(){
        $scope.formData.fromBudget = Number($scope.budget.fromBudget);
        $scope.formData.toBudget = Number($scope.budget.toBudget);
    });

    $scope.save = function(formData, mediaBooleanDict, mediaObjectDict, status){
        $scope.formData.status = status;
        //saving
        CampaignService.save(formData)
        .then(function(echoresponse){
            $scope.formData = echoresponse.data;

            if(echoresponse.data.status == "Draft"){
                $scope.state = $scope.states.SAVE_DRAFT_OK;
            }else if(echoresponse.data.status == 'Open'){
                $scope.state = $scope.states.SAVE_PUB_OK;
            }else{
                $scope.state = $scope.states.ERROR;
            }
            

            $location.hash('navbar');
            $anchorScroll();
        });
        
    };

}])
.controller('BrandProfileController', ['$scope', '$window', 'AccountService', '$location', function($scope, $window, AccountService, $location) {
    $scope.formData = {};
    AccountService.getProfile()
    .then(function(response){
        $scope.formData = response.data;
    });

    $scope.saveProfile = function(profile){
        AccountService.saveProfile()
        .then(function(response){
            $scope.formData = response.data;
            $scope.success = true;
        });
    };
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
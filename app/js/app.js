/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S04E02
 */
/* jshint node: true */
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'angular-loading-bar',
  'ui.bootstrap',
  'ngFileUpload',
  'ngTagsInput',
  'smoothScroll',
  'ngSanitize',
  //Top level
  'myApp.directives',
  'myApp.routes',
  'myApp.controller',
  //Controllers
  'myApp.portal.controller',
  'myApp.brand.controller',
  'myApp.influencer.controller',
  //Routes
  'myApp.portal.routes',
  'myApp.brand.routes',
  'myApp.influencer.routes'
])
//Mock data for testing
.constant('MockData', {
  categories: [
  {
    categoryName: 'ความงาม'
  },
  {
    categoryName: 'ความแมว'
  },
  {
    categoryName: 'ไก่ทอด'
  },
  {
    categoryName: 'แพทฟอม'
  },
  {
    categoryName: 'พารวย'
  },
  {
    categoryName: 'Double A'
  },
  {
    categoryName: 'CP ALL'
  }
]
})
//Example Campaign Constants (not mock)
.constant('ExampleCampaigns', [
      {
        resources: [{
            url: 'images/example-campaign/main-picture.png'
        }],
        title:'Morinaga Koeda รสใหม่',
        toBudget: 2000,
        media: [
          { mediaId: 'facebook' }
        ],
        fromBudget: 200,
        proposalDeadline: new Date(),
        category: { categoryName: 'ความสวยแมว'},
        linkTo:'brand-campaign-detail-example'
      },
      {
        resources: [{
            url: 'images/example-campaign/main-picture.png'
        }],
        media: [
          { mediaId: 'instagram' },
          { mediaId: 'youtube' }
        ],
        title:'Morinaga Koeda รสกาก',
        toBudget:1000,
        fromBudget: 500,
        proposalDeadline: new Date(),
        category: {categoryName: 'เกมส์'},
        linkTo:'brand-campaign-detail-example'
      }
])
//Configure the providers
.config(['$locationProvider','cfpLoadingBarProvider', function($locationProvider, cfpLoadingBarProvider) {
  // $locationProvider.hashPrefix('');
  // $routeProvider.otherwise({redirectTo: '/404'});
  cfpLoadingBarProvider.includeSpinner = false;
 
}])
.constant('BusinessConfig', {
  MIN_FOLLOWER_COUNT : 50
})
//Initialize the app
.run(['$rootScope', '$location', '$window', 'UserProfile', function($rootScope, $location, $window, UserProfile){

  //Configure Raven in production mode
  // Raven.config('http://7ee88ec43e8c4a27bd097ee60bd0435d@54.169.237.222/2').install();

  $rootScope.setUnauthorizedRoute = function (textString) {
    $window.localStorage.unauthorized_route = textString;
  };
    
  //Configure global deafult date options for date picker
  $rootScope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks: false
  };

  $rootScope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $rootScope.format = $rootScope.formats[0];

  //Global function helpers
  $rootScope.getProfile = UserProfile.get;
  $rootScope.signOut = function(msg){
    //clear localstorage
    var ur = $window.localStorage.unauthorized_route;
    if(!ur){
      ur = "/";
    }
    var redirTo = ur  + (msg ? '?message=' + msg : '');
    $window.localStorage.clear();
    //navigate to login
    console.log("redirecting to", redirTo);
    $window.location.href = redirTo;
  };

  $rootScope.goTo = function(path){
    console.error("$root.goTo is deprecated. Please stahp using it.");
  };

  $rootScope.getPath = function(){
    return $location.path();
  };

  //Route change event
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    console.log('$routeChangeStart', event, next, current);
  });

}]);

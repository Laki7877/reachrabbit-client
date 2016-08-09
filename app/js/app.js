/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'angular-loading-bar',
  'ui.bootstrap',
  'ngFileUpload',
  'ngTagsInput',
  'smoothScroll',
  'ngSanitize',
  'satellizer',
  //Top level
  'myApp.directives',
  'myApp.routes',
  'myApp.controller',
  //Controllers
  'myApp.portal.controller',
  'myApp.brand.controller',
  //Routes
  'myApp.portal.routes',
  'myApp.brand.routes',
  'myApp.influencer.routes'
])
//Example Campaign Constants
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
//Global Config
.constant('Config', {
  FACEBOOK_APP_ID: "",
  INSTAGRAM_APP_ID: "",
  YOUTUBE_APP_ID: ""
})
//Configure the providers
.config(['$locationProvider', '$routeProvider','cfpLoadingBarProvider', '$authProvider', 'Config', function($locationProvider, $routeProvider, cfpLoadingBarProvider, $authProvider, Config) {
  // $locationProvider.hashPrefix('');
  $routeProvider.otherwise({redirectTo: '/404'});
  cfpLoadingBarProvider.includeSpinner = false;
  
  $authProvider.facebook({
      clientId: Config.FACEBOOK_APP_ID
  });

}])
//Initialize the app
.run(['$rootScope', '$location', '$window', 'UserProfile', function($rootScope, $location, $window, UserProfile){
  
  //Configure Raven
  Raven.config('http://7ee88ec43e8c4a27bd097ee60bd0435d@54.169.237.222/2').install();

  //Configure global deafult date options for date picker
  $rootScope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1,
    showWeeks: false
  }; 
  $rootScope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $rootScope.format = $rootScope.formats[0];

  //Global function helpers
  $rootScope.getProfile = UserProfile.get;
  $rootScope.signOut = function(msg){
    //clear localstorage
    $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('profile');
    //navigate to login
    $window.location.href = '/portal.html#/brand-login'  + (msg ? '?message=' + msg : '');
  };
  $rootScope.goTo = function(path){
    $location.path(path);
  };
  $rootScope.getPath = function(){
    return $location.path();
  };
  
  //Route change event
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    console.log('$routeChangeStart', event, next, current);
    $rootScope.state = null;
  });

}]);

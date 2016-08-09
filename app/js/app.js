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
  //Top level
  'myApp.directives',
  'myApp.routes',
  'myApp.controller',
  //Controllers
  'myApp.portal.controller',
  'myApp.brand.controller',
  //Routes
  'myApp.portal.routes',
  'myApp.brand.routes'
])
.config(['$locationProvider', '$routeProvider','cfpLoadingBarProvider', function($locationProvider, $routeProvider, cfpLoadingBarProvider) {
  // $locationProvider.hashPrefix('');
  $routeProvider.otherwise({redirectTo: '/404'});
  cfpLoadingBarProvider.includeSpinner = false;
  
}])
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
.run(['$rootScope', '$location', '$window', 'UserProfile', function($rootScope, $location, $window, UserProfile){
  
  $rootScope.goTo = function(path){
    $location.path(path);
  };

  Raven.config('http://7ee88ec43e8c4a27bd097ee60bd0435d@54.169.237.222/2').install();

  $rootScope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1,
    showWeeks: false
  };

  $rootScope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $rootScope.format = $rootScope.formats[0];

  $rootScope.getProfile = UserProfile.get;
  $rootScope.signOut = function(msg){
    //clear localstorage
    $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('profile');
    //navigate to login
    $window.location.href = '/portal.html#/brand-login'  + (msg ? '?message=' + msg : '');
  };
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    console.log('$routeChangeStart', event, next, current);
    $rootScope.state = null;
  });

}]);
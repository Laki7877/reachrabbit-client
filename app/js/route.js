/**
 * Routes
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S04E01
 */
/* jshint node: true */
'use strict';


angular.module('myApp.routes', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
   $routeProvider.when('/404', {
    templateUrl: 'view/404.html',
    controller: 'EmptyController'
  });
}]);


angular.module('myApp.brand.routes', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {

  /* Brands */
  $routeProvider
  .when('/brand-campaign-list', {
    templateUrl: 'view/brand-campaign-list.html',
    controller: 'CampaignListController'
  })
  .when('/brand-campaign-detail-draft/:campaignId?', {
    templateUrl: 'view/brand-campaign-detail-draft.html',
    controller: 'CampaignDetailController'
  })
  .when('/brand-campaign-detail-example/:exampleId', {
    templateUrl: 'view/brand-campaign-detail-example.html',
    controller: 'CampaignExampleController'
  })
  .when('/brand-profile', {
    templateUrl: 'view/brand-profile.html',
    controller: 'BrandProfileController'
  });

}]);

angular.module('myApp.influencer.routes', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {

  /* Influencer */
  $routeProvider
  .when('/influencer-campaign-list', {
    templateUrl: 'view/influencer-campaign-list.html',
    controller: 'InfluencerCampaignListController'
  })
  .when('/influencer-profile', {
    templateUrl: 'view/influencer-profile.html',
    controller: 'InfluencerProfileController'
  });
  
  //TODO: Campaign-detail

}]);


angular.module('myApp.portal.routes', ['ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  

  $stateProvider
  .state('404', {
    url: '/404',
    templateUrl: 'view/404.html',
    controller: 'EmptyController'
  });

  $stateProvider
  .state('brand-login', {
      url: "/brand-login",
      templateUrl: "view/brand-login.html",
      controller: 'BrandSigninController'
  })
  .state('brand-signup', {
      url: "/brand-signup",
      templateUrl: "view/brand-signup.html",
      controller: 'BrandSignupController'
  })
  .state('influencer-portal', {
      url: "/influencer-portal",
      templateUrl: "view/influencer-portal.html",
      controller: 'InfluencerPortalController'
  })
  .state('influencer-signup-select-page', {
    url: "/influencer-signup-select-page",
    templateUrl: 'view/influencer-signup-select-page.html',
    controller: 'InfluencerFacebookPageSelectionController',
    params: { authData: null }
  })
  .state('influencer-signup-confirmation', {
    url: '/influencer-signup-confirmation',
    templateUrl: 'view/influencer-signup-confirmation.html',
    controller: 'InfluencerSignUpController',
    params: { authData: null }
  });

  $urlRouterProvider.otherwise("404");

}]);

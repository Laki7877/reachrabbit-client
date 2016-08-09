/**
 * Routes
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
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
    controller: 'EmptyController'
  });

}]);


angular.module('myApp.portal.routes', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {

  $routeProvider
  .when('/brand-login', {
    templateUrl: 'view/brand-login.html',
    controller: 'BrandSigninController'
  })
  .when('/brand-signup', {
    templateUrl: 'view/brand-signup.html',
    controller: 'BrandSignupController'
  })
  .when('/influencer-portal', {
    templateUrl: 'view/influencer-portal.html',
    controller: 'EmptyController'
  })
  .when('/influencer-signup-select-page', {
    templateUrl: 'view/influencer-signup-select-page.html',
    controller: 'EmptyController'
  })
  .when('/influencer-signup-confirmation', {
    templateUrl: 'view/influencer-signup-confirmation.html',
    controller: 'EmptyController'
  });

}]);

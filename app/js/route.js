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

  /*
  * Brands
  */
  $routeProvider
  .when('/brand-signup', {
    templateUrl: 'view/brand-signup.html',
    controller: 'BrandSignupController'
  })
  .when('/brand-campaign-list', {
    templateUrl: 'view/brand-campaign-list.html',
    controller: 'CampaignListController'
  })
  .when('/brand-campaign-detail-example', {
    templateUrl: 'view/brand-campaign-detail-example.html',
    controller: 'CampaignDetailController'
  })
  .when('/brand-profile', {
    templateUrl: 'view/brand-profile.html',
    controller: 'EmptyController'
  });

}]);

angular.module('myApp.portal.routes', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/brand-login', {
    templateUrl: 'view/brand-login.html',
    controller: 'BrandSigninController'
  });

}]);

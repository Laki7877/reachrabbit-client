/**
 * Routes
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Natt Phenjati <natt@phenjati.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

angular.module('myApp.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/404', {
    templateUrl: 'view/404.html',
    controller: 'EmptyController'
  });

  /*
  * Brands
  */
  $routeProvider.when('/brand-login', {
    templateUrl: 'view/brand-login.html',
    controller: 'BrandSigninController'
  })
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
    controller: 'EmptyController'
  });

}]);

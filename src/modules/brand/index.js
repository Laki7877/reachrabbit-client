/**
 * Brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

var components = [
  require('../../components/common')
];

angular.module('app.brand', components)
  .config(function($stateProvider) {
    /*
    * Main Layout
    */
    $stateProvider
      .state('main', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'abstract/main-brand.html'
          }
        }
      });

    /**
     * Account
     */
    $stateProvider
      .state('signin', {
        parent: 'main',
        url: '/signin',
        views: {
          '': {
            controller: 'brandAccountSigninController',
            templateUrl: 'views/brand-account-signin.html'
          },
          'menu@main': {}
        }
      })
      .state('profile', {
        parent: 'main',
        url: '/profile',
        views: {
          '': {
            controller: 'brandAccountProfileController',
            templateUrl: 'views/brand-account-profile.html'
          }
        }
      });

    /**
     * Campaign
     */
    $stateProvider
      .state('campaign', {
        parent: 'main',
        url: '/campaign',
        controller: 'brandCampaignListController',
        templateUrl: 'views/brand-campaign-list.html'
      })
      .state('campaign.create', {
        parent: 'main',
        url: '/campaign/create',
        controller: 'brandCampaignCreateController',
        templateUrl: 'views/brand-campaign-create.html'
      });

  });

require('bulk-require')(__dirname, ['**/*.js', '!main.js']);

module.exports = 'app.brand';

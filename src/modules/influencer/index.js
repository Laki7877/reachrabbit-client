/**
 * influencer module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

var components = [
  require('../../components/common')
];

angular.module('app.influencer', components)
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'abstract/main.html'
          }
        }
      })
      .state('profile', {
        parent: 'main',
        url: '/profile',
        views: {
          '': {
            controller: 'influencerAccountProfileController',
            templateUrl: 'views/influencer-profile.html'
          }
        }
      })
      .state('signin', {
        parent: 'main',
        url: '',
        views: {
          '': {
            controller: 'influencerAccountSigninController',
            templateUrl: 'views/influencer-account-signin.html'
          }
        }
      })
      .state('campaign', {
        parent: 'main',
        url: '/campaign',
        views: {
          '': {
            controller: 'influencerCampaignListController',
            templateUrl: 'campaign/influencer-campaign-list.html'
          }
        }

      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.influencer';

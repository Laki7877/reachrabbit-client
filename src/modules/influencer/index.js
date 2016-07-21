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
            templateUrl: 'abstract/main-influencer.html'
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
      .state('open-campaign', {
        parent: 'main',
        url: '/campaign/open',
        views: {
          '': {
            controller: 'influencerCampaignListController',
            templateUrl: 'views/influencer-open-campaign-list.html'
          }
        }
      })
      .state('open-campaign.detail', {
        url: '/:campaignId',
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-open-campaign-detail.html'
          }
        }
      })
      .state('my-campaign', {
        parent: 'main',
        url: '/campaign/my',
        views: {
          '': {
            controller: 'influencerCampaignMyController',
            templateUrl: 'views/influencer-campaign-my.html'
          }
        }
      });

  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.influencer';

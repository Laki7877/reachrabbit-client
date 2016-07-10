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
      .state('index-private', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'layouts/layout-private.html'
          }
        }
      })
      .state('profile', {
        parent: 'index-private',
        url: '/profile',
        views: {
          '': {
            controller: 'influencerAccountProfileController',
            templateUrl: 'account/influencer-profile.html'
          },
          'title@index-private': {
            templateUrl: 'account/title-profile.html'
          }
        }
      })
      .state('signin', {
        parent: 'index',
        url: '',
        views: {
          '': {
            controller: 'influencerAccountSigninController',
            templateUrl: 'account/influencer-account-signin.html'
          },
          'menu@index': {}
        }
      })
      .state('campaign', {
        parent: 'index-private',
        url: '/campaign',
        views: {
          'title@index-private': {
            templateUrl : 'campaign/title.html'
          },
          '': {
            controller: 'influencerCampaignListController',
            templateUrl: 'campaign/influencer-campaign-list.html'
          }
        }

      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.influencer';

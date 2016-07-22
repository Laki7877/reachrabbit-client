/**
 * influencer module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
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
        params: {alert: null},
        url: '/campaign/open', //done
        views: {
          '': {
            controller: 'influencerOpenCampaignListController',
            templateUrl: 'views/influencer-open-campaign-list.html'
          }
        }
      })
      .state('open-campaign.detail', {
        url: '/:campaignId', //done
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-open-campaign-detail.html'
          }
        }
      })
      .state('my-campaign', {
        parent: 'main',
        url: '/campaign/my', //done
        params: { alert: null},
        views: {
          '': {
            controller: 'influencerMyCampaignListController',
            templateUrl: 'views/influencer-my-campaign-list.html'
          }
        }
      })
      // .state('my-campaign.open', {
      //   url: '/open/:campaignId', //done
      //   views: {
      //     '@main': {
      //       controller: 'influencerCampaignDetailController',
      //       templateUrl: 'views/influencer-my-campaign-applied.html'
      //     }
      //   }
      // })
      .state('my-campaign.applied', {
        url: '/:campaignId', //done
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-my-campaign-applied.html'
          }
        }
      })
      .state('my-campaign.production', {
        url: '/production/:campaignId',
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-my-campaign-production.html'
          }
        }
      })
      .state('my-campaign.complete', {
        url: '/complete/:campaignId',
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-my-campaign-complete.html'
          }
        }
      })
      .state('transaction-list', {
        parent: 'main',
        url: '/transaction',
        views: {
          '': {
            controller: 'influencerTransactionListController',
            templateUrl: 'views/influencer-transaction-list.html'
          }
        }
      })

  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.influencer';

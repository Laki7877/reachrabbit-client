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
          'menu@main': {
            template: ''
          }
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
     * Influencer
     */
    $stateProvider
      .state('influencer', {
        parent: 'main',
        url: '/influencer',
        controller: 'brandInfluencerListController',
        templateUrl: 'views/brand-influencer-list.html'
      })
      .state('influencer-detail', {
        parent: 'main',
        url: '/influencer/:id',
        controller: 'brandInfluencerDetailController',
        templateUrl: 'views/brand-influencer-detail.html'
      });

    /**
     * Transaction
    */
    $stateProvider
      .state('transaction-list', {
        parent: 'main',
        url: '/transactions',
        controller: 'brandTransactionListController',
        templateUrl: 'views/brand-transaction-list.html'
    });

    /**
     * Campaign
     */
    $stateProvider
      .state('campaign-list', {
        parent: 'main',
        url: '/campaign',
        params: {
          alert: null
        },
        controller: 'brandCampaignListController',
        templateUrl: 'views/brand-campaign-list.html'
      })
      .state('campaign-list.create', {
        url: '/create',
        views: {
           '@main': {
              controller: 'brandCampaignDetailDraftController',
              templateUrl: 'views/brand-campaign-detail-draft.html'
            }
        }
      })
      .state('campaign-list.draft', {
        url: '/draft/:campaignId',
         views: {
          '@main': {
            controller: 'brandCampaignDetailDraftController',
            templateUrl: 'views/brand-campaign-detail-draft.html'
          }
        }
      })
      .state('campaign-list.open', {
        url: '/open/:campaignId',
        params: {'alert': null},
        views: {
          '@main': {
            controller: 'brandCampaignDetailOpenController',
            templateUrl: 'views/brand-campaign-detail-open.html'
          }
        }
      })
      .state('campaign-list.open.proposal-detail', {
        url: '/open/:campaignId',
        params: { user : null},
        views: {
          '@main': {
            controller: 'brandCampaignProposalDetailController',
            templateUrl: 'views/brand-campaign-proposal-detail.html'
          }
        }
      })
      .state('campaign-list.production', {
        url: '/production/:campaignId',
        params: { alert : null},
        views: {
          '@main': {
            controller: 'brandCampaignSubmissionListController',
            templateUrl: 'views/brand-campaign-detail-production.html'
          }
        }
      })
      .state('campaign-list.production.submission-detail', {
        url: '/submission/:submissionId',
        views: {
          '@main': {
             controller: 'brandCampaignSubmissionDetailController',
             templateUrl: 'views/brand-submission-detail.html'
          }
        }
      })
      .state('campaign-list.open.pay', {
        url: '/payment',
        params: { campaign : null, allProposals: null, selected: null, budget: null, reach: null},
        resolve: {
          campaign: function($stateParams, $api) {
            return $api({
              method: 'GET',
              url: '/campaigns/' + $stateParams.campaignId
            });
          }
        },
        views: {
          '@main': {
            controller: 'brandCampaignPaymentController',
            templateUrl: 'views/brand-campaign-pay.html'
          }
        }
      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!main.js']);

module.exports = 'app.brand';

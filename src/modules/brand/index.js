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
     * Campaign
     */
    $stateProvider
      .state('campaign', {
        parent: 'main',
        url: '/campaign',
        controller: 'brandCampaignListController',
        templateUrl: 'views/brand-campaign-list.html'
      })
      .state('campaign-create', {
        parent: 'main',
        url: '/campaign/create',
        controller: 'brandCampaignDetailDraftController',
        templateUrl: 'views/brand-campaign-detail-draft.html'
      })
      .state('campaign-detail-draft', {
        parent: 'main',
        url: '/campaign/draft/:campaignId',
        controller: 'brandCampaignDetailDraftController',
        templateUrl: 'views/brand-campaign-detail-draft.html'
      })
      .state('campaign-detail-open', {
        parent: 'main',
        url: '/campaign/open',
        abstract: true
      })
      .state('campaign-detail-open.detail', {
        url: '/:campaignId',
        views: {
          '@main': {
            controller: 'brandCampaignDetailOpenController',
            templateUrl: 'views/brand-campaign-detail-open.html'
          }
        }
      })
      .state('campaign-detail-open.detail.proposal', {
        url: '/proposal',
        params: { user : null},
        views: {
          '@main': {
            controller: 'brandCampaignProposalDetailController',
            templateUrl: 'views/brand-campaign-proposal-detail.html'
          }
        }
      })
      .state('campaign-detail-production', {
        parent: 'main',
        url: '/campaign/production/:id',
        controller: 'brandCampaignSubmissionController',
        templateUrl: 'views/brand-campaign-detail-production.html'
      })
      .state('campaign-detail-open.detail.pay', {
        url: '/payment',
        params: { campaign : null},
        resolve: {
          campaign: function($stateParams, $api) {
            return $api({
              method: 'GET',
              url: '/campaigns/' + $stateParams.campaignId
            });
          }
        }
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

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
            templateUrl: 'layouts/main.html'
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
          },
          'menu@main': {
            templateUrl: 'partials/account-profile-menu.html'
          },
          'title@main': {
            templateUrl: 'partials/account-profile-title.html'
          }
        }
      });

    /**
     * Others ui.router
     */
    $stateProvider
      .state('submission', {
        parent: 'main',
        url: '/submission/:id',
        templateUrl: 'submission/brand-submission-detail.html'
      })
      // proposal
      .state('proposal', {
        parent: 'main',
        url: '/proposal/:id',
        templateUrl: 'proposal/brand-proposal-detail.html'
      })
      // campaign
      .state('campaign', {
        parent: 'main',
        url: '/campaign',
        abstract: true
      })
      .state('campaign.proposal', {
        url: '/proposal/:id',
        controller: 'brandProposalController',
        templateUrl: 'proposal/brand-proposal-detail.html'
      })
      .state('campaign.submission', {
        url: '/payment/:id',
        controller: 'brandSubmissionController',
        templateUrl: 'submission/brand-submission-detail.html'
      })
      .state('campaign.list', {
        url: '',
        views: {
          '@main': {
            controller: 'brandCampaignListController',
            templateUrl: 'campaign/brand-campaign-list.html'
          },
          'title@main': {
            templateUrl: 'campaign/title.html'
          }
        }
      })
      .state('campaign.create', {
        url: '/create',
        controller: 'brandCampaignCreateController',
        templateUrl: 'campaign/brand-campaign-create.html'
      })
      .state('campaign.detail', {
        url: '/:id',
        views: {
          '': {
            controller: 'brandCampaignDetailController',
            templateUrl: 'campaign/brand-campaign-detail.html'
          },
          'menu': {
            templateUrl: 'campaign/brand-campaign-detail-title.html'
          }
        }
      })
      .state('campaign.detail.draft', {
        controller: 'brandCampaignDetailController',
        templateUrl: 'campaign/brand-campaign-detail-draft.html'
      })
      .state('campaign.detail.open', {
        controller: 'brandCampaignDetailController',
        templateUrl: 'campaign/brand-campaign-detail-open.html'
      })
      .state('campaign.detail.open.payment', {
        url: '/payment',
        views: {
          'menu@campaign.detail': {},
          '@campaign-detail': {
            controller: 'brandCampaignPaymentController',
            templateUrl: 'campaign/brand-campaign-pay.html'
          }
        }
      })
      .state('campaign.detail.production', {
        controller: 'brandCampaignDetailController',
        templateUrl: 'campaign/brand-campaign-production.html'
      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!main.js']);

module.exports = 'app.brand';

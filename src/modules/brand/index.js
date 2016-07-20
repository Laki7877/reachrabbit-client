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
        controller: 'brandCampaignDetailController',
        templateUrl: 'views/brand-campaign-detail-draft.html'
      })
      .state('campaign-detail-draft', {
        parent: 'main',
        url: '/campaign/draft/:id',
        controller: 'brandCampaignDetailController',
        templateUrl: 'views/brand-campaign-detail-draft.html'
      })
      .state('campaign-detail-open', {
        parent: 'main',
        url: '/campaign/open/:id',
        controller: 'brandCampaignProposalController',
        templateUrl: 'views/brand-campaign-detail-open.html'
      })
      .state('campaign-detail-production', {
        parent: 'main',
        url: '/campaign/production/:id',
        controller: 'brandCampaignSubmissionController',
        templateUrl: 'views/brand-campaign-detail-production.html'
      });

  });

require('bulk-require')(__dirname, ['**/*.js', '!main.js']);

module.exports = 'app.brand';

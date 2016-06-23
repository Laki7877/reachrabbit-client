/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.brand', components)
	.config(function($stateProvider) {
		$stateProvider
			.state('index', { //root level state
				abstract: true,
				views: {
					'@': {
						templateUrl: 'layout.html'
					},
          'menu@index': {
            templateUrl: 'menu.html',
            controller: function($scope, $api) {
              $api({
                url: '/me',
                method: 'GET'
              }).then(function(profile) {
                $scope.profile = profile;
              });
            }
          }
				}
			})
			// accounts
			.state('signin', {
				parent: 'index',
				url: '/signin',
				views: {
					'': {
						controller: 'brandAccountSigninController',
						templateUrl: 'account/brand-account-signin.html'
					},
					'menu@index': {}
				}
			})
			.state('signup', {
				parent: 'index',
				url: '/signup',
				views: {
					'': {
						controller: 'brandAccountSignupController',
						templateUrl: 'account/brand-account-signup.html'
					},
					'menu@index': {}
				}
			})
        .state('signup.detail', {
          params: {
            data: null
          },
          views: {
            '@index': {
              controller: 'brandAccountSignupDetailController',
              templateUrl: 'account/brand-account-signup-detail.html'
            },
            'menu@index': {}
          }
        })
      .state('confirm', {
        parent: 'index',
        url: '/confirm?q',
        views: {
          '@index': {
            controller: 'brandAccountConfirmController'
          },
          'menu@index': {}
        }
      })
			// submission
			.state('submission', {
				parent: 'index',
				url: '/submission/:id',
				templateUrl: 'submission/brand-submission-detail.html'
			})
			// proposal
			.state('proposal', {
				parent: 'index',
				url: '/proposal/:id',
				templateUrl: 'proposal/brand-proposal-detail.html'
			})
			// campaign
			.state('campaign', {
				parent: 'index',
				url: '/campaign',
				abstract: true,
				template: '<div data-ui-view></div>'
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
					controller: 'brandCampaignListController',
					templateUrl: 'campaign/brand-campaign-list.html'
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

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.brand';

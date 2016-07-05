/**
 * influencer module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.influencer', components)
	.config(function($stateProvider) {
		$stateProvider
			.state('index', {
				abstract: true,
				views: {
					'@': {
						templateUrl: 'layout.html'
					},
					'menu@index': {
						templateUrl: 'menu.html',
            resolve: {
              profile: function($api, $q) {
                return {};
              }
            },
            controller: function($scope, profile) {
              $scope.profile = profile;
            }
					}
				}
			})
			//account
			.state('signin', {
				parent: 'index',
				url: '/signin',
				views: {
					'': {
						controller: 'influencerAccountSigninController',
						templateUrl: 'account/influencer-account-signin.html'
					}
				}
			})
			.state('signup', {
				parent: 'index',
				url: '/signup',
        resolve: {
          fbProfile: function($storage) {
            var profile = $storage.get('fblogin');
            return profile;
          }
        },
				views: {
					'': {
						controller: 'influencerAccountSignupController',
						templateUrl: 'account/influencer-account-signup.html'
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
              controller: 'influencerAccountSignupDetailController',
              templateUrl: 'account/influencer-account-signup-detail.html'
            }
          }
        })
      .state('confirm', {
        parent: 'index',
        url: '/confirm?q',
        views: {
          '@index': {
            controller: 'influencerAccountConfirmController'
          },
          'menu@index': {}
        }
      })
      .state('campaign', {
        parent: 'index',
        url: '/campaign',
        controller: 'influencerCampaignListController',
        templateUrl: 'campaign/influencer-campaign-list.html'
      });
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.influencer';

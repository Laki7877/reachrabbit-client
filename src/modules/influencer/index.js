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
        abstract: true,
				url: '/signup',
        resolve: {
          socialProfile: function($storage) {
            return $storage.get('profile-signup');
          }
        },
        redirectTo: 'signup.1',
				views: {
					'@index': {
						controller: 'influencerAccountSignupController',
						templateUrl: 'account/influencer-account-signup.html'
					},
					'menu@index': {}
				}
			})
        .state('signup.1', {
          url: '',
          templateUrl: 'account/influencer-account-signup-1.html'
        })
        .state('signup.2', {
          templateUrl: 'account/influencer-account-signup-2.html'
        })
      .state('confirm', {
        parent: 'index',
        url: '/profile',
        views: {
          '@index': {
            controller: 'influencerAccountConfirmController'
          },
          'menu@index': {}
        }
      })
      .state('profile', {
        parent: 'index',
        abstract: true,
        url: '/signup',
        views: {
          '@index': {
            controller: 'influencerAccountSignupController',
            templateUrl: 'account/influencer-profile.html'
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

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

angular.module('app.inf', components)
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
                var deferred = $q.defer();
                $api({
                  url: '/me',
                  method: 'GET'
                }).then(deferred.resolve, function() {
                  deferred.resolve({});
                });
                return deferred.promise;
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
						controller: 'infAccountSigninController',
						templateUrl: 'account/influencer-account-signin.html'
					},
					'menu@index': {}
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
						controller: 'infAccountSignupController',
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
              controller: 'infAccountSignupDetailController',
              templateUrl: 'account/influencer-account-signup-detail.html'
            },
            'menu@index': {}
          }
        })
      .state('confirm', {
        parent: 'index',
        url: '/confirm?q',
        views: {
          '@index': {
            controller: 'infAccountConfirmController'
          },
          'menu@index': {}
        }
      })
      .state('campaign', {
        parent: 'index',
        url: '/campaign',
        controller: 'infCampaignListController',
        templateUrl: 'campaign/influencer-campaign-list.html'
      });
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.inf';

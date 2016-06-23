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
						templateUrl: 'menu.html'
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
						templateUrl: 'account/inf-account-signin.html'
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
            $storage.remove('fblogin');
            return profile;
          }
        },
				views: {
					'': {
						controller: 'infAccountSignupController',
						templateUrl: 'account/inf-account-signup.html'
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
              templateUrl: 'account/inf-account-signup-detail.html'
            },
            'menu@index': {}
          }
        });
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.inf';

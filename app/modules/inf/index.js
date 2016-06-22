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
				views: {
					'': {
						controller: 'infAccountSignupController',
						templateUrl: 'account/inf-account-signup.html'
					},
					'menu@index': {}
				}
			});
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.inf';

/**
 * Landing Module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.landing', components)
	.config(function ($stateProvider) {
		$stateProvider
			/*
			* Abstract Sign Up Layout
			*/
			.state('abstract-signup', {
				abstract: true,
				templateUrl: 'layouts/layout-signup.html'
			})
			/*
			* Top level Landing page
			*/
			.state('home', {
				url: '',
				controller: 'landingController'
			})
			/*
			* Brand Landing page
			*/
			.state('brand', {
				url: '/brand',
				controller: 'landingBrandController',
				templateUrl: 'views/landing-brand.html'
			})
			/*
			* Influencer Landing Page
			*/
			.state('influencer', {
				url: '/influencer',
				controller: 'landingInfluencerController',
				templateUrl: 'views/landing-influencer.html'
			})
			/*
			* Influencer Sign Up Page
			*/
			.state('influencer-signup', {
				parent: 'abstract-signup',
				abstract: true,
				url: '/influencer/signup',
				resolve: {
					socialProfile: function ($storage) {
						return $storage.get('profile-signup');
					}
				},
				redirectTo: 'influencer-signup.1',
				views: {
					'': {
						controller: 'influencerAccountSignupController',
						templateUrl: 'views/influencer-account-signup.html'
					}
				}
			})
			/*
			* Influencer Signup Page 1
			*/
			.state('influencer-signup.1', {
				url: '',
				parent: 'influencer-signup',
				templateUrl: 'views/influencer-account-signup-1.html'
			})
			/*
			* Influencer Signup page 2
			*/
			.state('influencer-signup.2', {
				parent: 'influencer-signup',
				templateUrl: 'views/influencer-account-signup-2.html'
			})
			/*
			* Brand Sign up pages
			*/
			.state('brand-signup', {
				parent: 'abstract-signup',
				url: '/brand/signup',
				views: {
					'': {
						controller: 'brandAccountSignupController',
						templateUrl: 'views/brand-account-signup.html'
					},
					'menu@index': {}
				}
			});

	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.landing';

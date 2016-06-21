'use strict';

angular.module('app.landing', ['app.common'])
	.config(function($stateProvider) {
		$stateProvider
			.state('brand', {
				url: '/brand',
				controller: 'landingBrandController',
				templateUrl: 'landing-brand.html'
			})
			.state('influencer', {
				url: '/influencer',
				controller: 'landingInfluencerController',
				templateUrl: 'landing-influencer.html'
			});
	});

var bulk = require('bulk-require');
bulk(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.landing';

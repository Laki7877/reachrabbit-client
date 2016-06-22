/**
 * landing module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.landing', components)
	.config(function($stateProvider) {
		$stateProvider
			.state('brand', {
				url: '/brand',
				controller: 'landingBrandController',
				templateUrl: 'landing-brand.html'
			})
			.state('inf', {
				url: '/inf',
				controller: 'landingInfController',
				templateUrl: 'landing-inf.html'
			});
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.landing';

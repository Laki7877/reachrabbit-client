/**
 * Landing page controllers
 * 
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.landing')
	.controller('landingBrandController', function() {
		
	})
	.controller('landingInfController', function($scope, $auth) {
		$scope.loginWithFB = function() {
			$auth.authenticate('facebook')
				.then(function(data) {
					console.log(data);
				})
				.catch(function(err) {
					console.error(err);
				});
		}
	});


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
	.controller('landingInfController', function($scope, $window, $auth, $storage) {
		$scope.loginWithFB = function() {
			$auth.authenticate('facebook')
				.then(function(res) {
          $storage.put('fblogin', res.data);
          //console.log($storage.get('fblogin'));
          $window.location.href = '/inf#signup';
				})
				.catch(function(err) {
          console.log(err);
        });
		}
	});


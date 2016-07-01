/**
 * Landing page controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.landing')
	.controller('landingBrandController', function() {

	})
	.controller('landingInfluencerController', function($scope, $window, $auth, $storage) {


		$scope.loginWithFB = function() {
			$auth.authenticate('facebook')
				.then(function(res) {
          if(res.data.isLogin) {
            $storage.put('auth', res.data.token);
            $window.location.href= '/influencer#/campaign';
          } else {
            $storage.put('fblogin', res.data);
            $window.location.href = '/influencer#/signup';
				  }
        })
				.catch(function(err) {
          console.log(err);
        });
		};
	});


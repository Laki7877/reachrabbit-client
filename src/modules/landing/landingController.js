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
    $scope.loadingTop = false;

    function authOK(res) {
          if(res.data.isLogin) {
            $storage.put('auth', res.data.token);
            $window.location.href= '/influencer#/campaign';
          } else {

            $storage.put('profile-signup', {
              'provider': res.data.provider,
              'data': res.data
            });
            $window.location.href = '/influencer#/signup';
          }
    }

    $scope.loginWithYT = function(){
      $scope.loadingTop = true;
      $auth.authenticate('google')
        .then(authOK)
        .catch(function(err) {
          console.log(err);
        });

    }

    $scope.loginWithIG = function(){
      $scope.loadingTop = true;
      $auth.authenticate('instagram')
        .then(authOK)
        .catch(function(err) {
          console.log(err);
        });
    }

		$scope.loginWithFB = function() {
      $scope.loadingTop = true;
			$auth.authenticate('facebook')
				.then(authOK)
				.catch(function(err) {
          console.log(err);
        });
		};
	});


/**
 * Landing page controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.landing')
  .controller('landingController', function($state) {
    $state.go('brand');
  })
	.controller('landingBrandController', function($scope, $window) {
    $scope.signup = function() {
      $window.location.href = '/brand#/signup';
    };
    $scope.signin = function() {
      $window.location.href = '/brand#/signin';
    };
	})
	.controller('landingInfluencerController', function($scope, $window, $auth, $storage) {
    $scope.loadingTop = false;

    $scope.loginWithYT = function(){
      $scope.loadingTop = true;
      $auth.authenticate('google')
        .then(function(res) {
          if(res.data.isLogin) {
            $storage.put('auth', res.data.token);
            $window.location.href= '/influencer#/campaign';
          } else {
            $storage.put('profile-signup', {
              'provider': 'google',
              'data': res.data
            });
            $window.location.href = '/influencer#/signup';
          }
        })
        .catch(function(err) {
          $scope.loadingTop = false;
          console.log(err);
        });
    }

		$scope.loginWithFB = function() {
      $scope.loadingTop = true;
			$auth.authenticate('facebook')
				.then(function(res) {
          if(res.data.isLogin) {
            $storage.put('auth', res.data.token);
            $window.location.href= '/influencer#/campaign';
          } else {
            $storage.put('profile-signup', {
              'provider': 'facebook',
              'data': res.data
            });
            $window.location.href = '/influencer#/signup';
				  }
        })
				.catch(function(err) {
          $scope.loadingTop = false;
          console.log(err);
        });
		};
	});


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
	.controller('landingInfluencerController', function($scope, $window, $auth, $mdDialog, $storage) {
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

    function authNOK(err) {

          console.log(err);

          if(err.data.display){
            $scope.loadingTop = false;
            console.log("showing alert");
            $mdDialog.show(
            $mdDialog.alert()
            .title(err.data.display.title + " (" +  err.data.exception_code + ")")
            .textContent(err.data.display.message)
            .ok('Got it!'));
          }

    }

    $scope.loginWithYT = function(){
      $scope.loadingTop = true;
      $auth.authenticate('google')
        .then(authOK)
        .catch(authNOK);

    }

    $scope.loginWithIG = function(){
      $scope.loadingTop = true;
      $auth.authenticate('instagram')
        .then(authOK)
        .catch(authNOK);
    }

		$scope.loginWithFB = function() {
      $scope.loadingTop = true;
			$auth.authenticate('facebook')
				.then(authOK)
				.catch(authNOK);
		};
	});


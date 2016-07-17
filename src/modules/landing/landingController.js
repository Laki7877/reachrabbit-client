/**
 * Landing page controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.2
 */
'use strict';
var loadSocialProfile = require('./socialProfile');

angular.module('app.landing')
  /*
  *
  *  Landing top level
  *
  */
  .controller('landingController', function($state) {
    //redirect to influencer
    $state.go('influencer');
  })
  /*
  *
  *  Brand Landing
  *
  */
	.controller('landingBrandController', function($scope, $window) {
    $scope.signup = function() {
      $window.location.href = '/#/brand/signup';
    };
    $scope.signin = function() {
      $window.location.href = '/#/brand/signin';
    };
	})
  /*
  *
  *  Influencer Landing
  *
  */
  .controller('landingInfluencerController', function($scope, $window, $mdMedia, $auth, $mdDialog, $uibModal, $storage) {
    $scope.loadingTop = false;
    $scope.socialAcc = {};

    $scope.onAlreadyLoggedIn = function(d){
      console.log('onAlreadyLoggedIn', d);
      $window.location.href= '/influencer#/profile';
    }

    $scope.socialSelectionDone = function(data) {
      console.log("Auth OK", data)
        $storage.put('profile-signup', {
          'provider': data.provider,
          'data': data
        });
        $window.location.href = '/#/influencer/signup';
    }

	})
  /*
  *
  *  Influencer Sign In
  *
  */
  .controller('influencerAccountSigninController', function($scope) {
    $scope.formData = {};
    $scope.submit = function(form) {};
  });

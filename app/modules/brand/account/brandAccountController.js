/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
	.controller('brandAccountSignupController', function($scope, $state, $api) {
    $scope.formData = {};
    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/register/brand',
        data: $scope.formData
      }).then(function(data) {
        $scope.message = 'Please check your email';
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };
	})
	.controller('brandAccountSigninController', function($scope, $state, $storage, $api) {
    $scope.formData = {};
    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/login',
        data: $scope.formData
      }).then(function(data) {
        $storage.put('auth', data.token);
        $state.go('campaign.list');
      }).catch(function(err) {
        $scope.message = err.message;
      });
    }
	})
  .controller('brandAccountConfirmController', function($state, $stateParams, $api, $storage) {
    //confirm endpoint
    $api({
      method: 'POST',
      url: '/confirm',
      data: {
        token: $stateParams.q
      }
    }).then(function(data, s) {
      console.log(data, s);
      $storage.put('auth', data.token);
      $state.go('campaign.list'); //goto campaign list
    }).catch(function(err) {
      console.log(err);
    });
  });

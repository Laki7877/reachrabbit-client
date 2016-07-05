/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.influencer')
	.controller('influencerAccountSigninController', function($scope) {
    $scope.formData = {};
    $scope.submit = function() {
    };
	})
	.controller('influencerAccountSignupController', function($scope, $state, $uploader, fbProfile) {
		$scope.formData = {
      facebookId: fbProfile.id,
      facebookToken: fbProfile.token,
      name: fbProfile.name,
      email: fbProfile.email
    };

    // pass forward info
    $scope.submit = function() {
      $state.go('.detail', {
        data: $scope.formData
      });
    };

    $scope.upload = function(file) {
      $uploader.upload('/file_demo', file)
        .then(function(data) {
          $scope.formData.picture = data.url;
        });
    };
	})
  .controller('influencerAccountSignupDetailController', function($scope, $api, $stateParams) {
    $scope.formData = $stateParams.data;
    $scope.message = '';

    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/register/influencer',
        data: $scope.formData
      }).then(function(data) {
        $scope.message = 'Please check your email';
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };
  })
  .controller('influencerAccountConfirmController', function($state, $stateParams, $api, $storage) {
    //confirm endpoint
    $api({
      method: 'POST',
      url: '/confirm',
      data: {
        token: $stateParams.q
      }
    }).then(function(data) {
      $storage.put('auth', data.token);
      $state.go('campaign'); //goto campaign list
    }).catch(function(err) {
      console.log(err);
    });
  });

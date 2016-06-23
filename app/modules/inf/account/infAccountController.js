/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.inf')
	.controller('infAccountSigninController', function($scope) {

	})
	.controller('infAccountSignupController', function($scope, $state, fbProfile) {
		$scope.formData = {
      facebookId: fbProfile.id,
      facebookToken: fbProfile.token,
      name: fbProfile.name,
      email: fbProfile.email,
      picture: fbProfile.picture.data.url
    };

    // pass forward info
    $scope.submit = function() {
      $state.go('.detail', {
        data: $scope.formData
      });
    };
	})
  .controller('infAccountSignupDetailController', function($scope, $api, $stateParams) {
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
  });

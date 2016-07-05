/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';
angular.module('app.brand')
	.controller('brandAccountSignupController', function($scope, $state, $api) {
    $scope.submit = function() {

    };
	})
	.controller('brandAccountSigninController', function($scope, $state, $storage, $api) {
    // on form submit
    $scope.submit = function() {
      // validate form
      if(form.$valid) {
        // call api
        $api({
          method: 'POST',
          url: '/login',
          data: $scope.formData
        }).then(function(data) {
          $storage.putAuth(data.token);
          $state.go('campaign.list');
        }).catch(function(err) {
          console.error(err);
        });
      }
    };
	});

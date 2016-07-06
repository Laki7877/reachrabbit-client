/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';
angular.module('app.brand')
	.controller('brandAccountSignupController', function($scope, $state, $api, $mdToast, $uploader, $storage) {
    $scope.formData = $storage.get('brandAccountSignupFormData') || {};
    $scope.loadingImage = false;

    $scope.$watch('formData', function(newObject) {
      $storage.put('brandAccountSignupFormData', newObject);
    });

    $scope.upload = function(file) {
      $scope.loadingImage = true;
      $uploader.upload('/file', file)
        .then(function(data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data;
        });
    };
    $scope.submit = function(form) {
      console.log(form);
      // invalid form
      if(form.$invalid) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Please enter required fields')
            .position('top right')
            .hideDelay(3000)
        );
        return;
      }

      //post to brand signup
      $api({
        method: 'POST',
        url: '/signup/brand',
        data: $scope.formData
      }).then(function(data) {
        $storage.putAuth(data.token);
        $storage.remove('brandAccountSignupFormData');
        $state.go('campaign.list');
      }).catch(function(err) {
        console.error(err);
      });
    };
	})
	.controller('brandAccountSigninController', function($scope, $state, $storage, $api, $mdToast) {
    // on form submit
    $scope.submit = function(form) {
      // invalid form
      if(form.$invalid) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Please enter required fields')
            .position('top right')
            .hideDelay(3000)
        );
        return;
      }

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
    };
	});

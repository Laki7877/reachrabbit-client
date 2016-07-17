/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';
angular.module('app.brand')
  .controller('brandAccountProfileController', function($scope, $state, $api, $mdToast, $uploader, $storage){
    //Hacky, will change after TODO: Friday
    document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    document.getElementsByTagName("body")[0].style.backgroundColor = "#ebebeb";
    $scope.formData = {
      socialAccounts: {}, selectedTopics: []
    };

    $scope.upload = function(file) {
      $scope.loadingImage = true;
      $uploader.upload('/file', file)
        .then(function(data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data;
        });
    };

    //get user info
    $api({
      method: 'GET',
      url: '/me'
    }).then(function(data) {
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function(err) {
      console.log(err);
    });


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

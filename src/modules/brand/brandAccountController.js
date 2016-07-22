/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';
angular.module('app.brand')
  .controller('brandAccountProfileController', function ($scope, $state, $api, $uploader, $storage) {
    //Hacky, will change after TODO: Friday
    document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    document.getElementsByTagName("body")[0].style.backgroundColor = "#ebebeb";
    $scope.formData = {
      socialAccounts: {}, selectedTopics: []
    };

    $scope.upload = function (file) {
      $scope.loadingImage = true;
      $uploader.upload('/file', file)
        .then(function (data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data;
        });
    };

    //get user info
    $api({
      method: 'GET',
      url: '/profiles'
    }).then(function (data) {
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function (err) {
      console.log(err);
    });

  })
  .controller('brandAccountSigninController', function ($scope, $state, $storage, $api) {
    // on form submit
    $scope.submit = function (form) {
      // call api
      $api({
        method: 'POST',
        url: '/login',
        data: $scope.formData
      }).then(function (data) {
        $storage.put('profile', data);
        $storage.put('auth', data.token);
        //Get user info
        return $api({
          method: 'GET',
          url: '/profiles'
        });
      })
      .then(function(data) {
          $state.go('campaign-list');
      })
      .catch(function (err) {
        console.error(err);
      });
    };
  });

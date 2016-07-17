/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';


angular.module('app.influencer')
  /*
  *
  * deprecated
  *
  */
  .controller('influencerAccountConfirmController', function($scope) {
    $scope.formData = {};
  })
  /*
  * Influencer Profile
  *
  */
  .controller('influencerAccountProfileController', function($scope,$uploader, $auth, $mdToast, $mdDialog, $api) {

    $scope.S3_PUBLIC_URL = process.env.S3_PUBLIC_URL;

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


    //Get user info
    $api({
      method: 'GET',
      url: '/me'
    }).then(function(data) {
      console.log(data)
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function(err) {
      console.log(err);
    });


    function authNOK(err) {
      if (err.data && err.data.display) {
        alert(err.data.display.message)
      }
    }



  })

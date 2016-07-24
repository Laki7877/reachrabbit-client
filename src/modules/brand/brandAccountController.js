/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';
angular.module('app.brand')
  .controller('brandAccountProfileController', function ($scope, NcAlert, $state, $api, $uploader, $storage) {
    //Hacky, will change after TODO: Friday
    document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    document.getElementsByTagName("body")[0].style.backgroundColor = "#ebebeb";
    $scope.formData = {

    };
    $scope.alert = new NcAlert();

    $scope.saveProfile = function(){
      //get user info
      $api({
        method: 'PUT',
        url: '/profiles',
        data: $scope.formData
      }).then(function (data) {
        $scope.formData = _.extend($scope.formData, data);
        $scope.alert.success("Profile Updated");
      }).catch(function (err) {
        console.log(err);
        $scope.alert.error("Oops! Blame the D Team");
      });

    }

    //get user info
    $api({
      method: 'GET',
      url: '/profiles'
    }).then(function (data) {
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function (err) {
      console.log(err);
      $scope.alert.error("Oops! Blame the D Team");
    });

  });

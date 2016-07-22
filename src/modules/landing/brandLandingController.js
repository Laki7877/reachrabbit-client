/**
 * Brand Landing page controllers
 *
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.2
 */
 var loadSocialProfile = require('./socialProfile');
angular.module('app.landing')
.controller('brandAccountSignupController', function($scope, $state, $api, $uploader, $storage) {
    $scope.formData = $storage.get('brandAccountSignupFormData') || {};
    $scope.formData.brand = {};
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
    $scope.submit = function() {

      //post to brand signup
      $api({
        method: 'POST',
        url: '/users/brand',
        data: $scope.formData
      }).then(function(data) {
        $storage.putAuth(data.token);
        $storage.remove('brandAccountSignupFormData');
        window.location.href = '/brand#/profile'
      }).catch(function(err) {
        console.error(err);
      });
    };
});

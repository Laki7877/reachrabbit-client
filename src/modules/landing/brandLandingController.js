/**
 * Brand Landing page controllers
 *
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.1
 */
 var loadSocialProfile = require('./socialProfile');
angular.module('app.landing')
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
        window.location.href = '/brand#/profile'
      }).catch(function(err) {
        console.error(err);
      });
    };
});

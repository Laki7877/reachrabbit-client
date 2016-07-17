/**
 * Inf landing page controllers
 *
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.1
 */
 var loadSocialProfile = require('./socialProfile');
angular.module('app.landing')
.controller('influencerAccountSignupController',
  function($scope, $storage, $state, $api, $uploader, $auth, socialProfile) {

    $scope.formData = $scope.formData || {
      influencer: {
        influencerMedia: {},
        interests: []
      }
    };

    $scope.loadingImage = false;
    $scope.message = '';

    $scope.linkSuccess = function(socialProfile){
      console.log('linked success', socialProfile);
    }

    $scope.linkFail = function(x){
      console.log('linkFailure', x);
    }

    // go back
    $scope.back = function() {
      $state.go('^.1');
    };
    // go next
    $scope.next = function() {
      $state.go('^.2');
    };

    //Sign up influencer
    $scope.submit = function() {
      console.log('$scope.formData', $scope.formData);
      $api({
        method: 'POST',
        url: '/signup/influencer',
        data: $scope.formData
      }).then(function(data) {
        window.location.href = '/influencer#/profile'
        $storage.putAuth(data.token);
        $storage.remove('profile-signup');
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };

    //load social profile from main landing page singup flow
    loadSocialProfile(socialProfile, $api, $scope.formData);
  });

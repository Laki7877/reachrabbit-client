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
        socialAccounts: {},
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
        url: '/users/influencer',
        data: $scope.formData
      }).then(function(data) {
        $storage.putAuth(data.token);
        //Get user info
        return $api({
          method: 'GET',
          url: '/profiles'
        });
      })
      .then(function(data) {
          $storage.put('profile', data);
          $storage.remove('profile-signup');
          window.location.href = '/influencer#/campaign/open'
      })
      .catch(function(err) {
        $scope.message = err.message;
      });
    };

    //load social profile from main landing page singup flow
    loadSocialProfile(socialProfile, $api, $scope.formData);
  })
/*
  *
  *  Landing top level
  *
  */
  .controller('landingController', function($state) {
    //redirect to influencer
    $state.go('influencer');
  })
  /*
  *
  *  Brand Landing
  *
  */
  .controller('landingBrandController', function($scope, $window) {
    $scope.signup = function() {
      $window.location.href = '/#/brand/signup';
    };
    $scope.signin = function() {
      $window.location.href = '/#/brand/signin';
    };
  })
  /*
  *
  *  Influencer Landing
  *
  */
  .controller('landingInfluencerController', function($scope, $window, $api, $auth, $uibModal, $storage) {
    $scope.loadingTop = false;
    $scope.socialAcc = {};

    $scope.onAlreadyLoggedIn = function(d){
      console.log('onAlreadyLoggedIn', d);
      $storage.putAuth(d.token);
      $api({
          method: 'GET',
          url: '/profiles'
      }).then(function(data){
        $storage.put('profile', data);
        $window.location.href= '/influencer#/campaign/open';
      });

    }

    $scope.socialSelectionDone = function(data) {
      console.log("Auth OK", data)
        $storage.put('profile-signup', {
          'provider': data.provider,
          'data': data
        });
        $window.location.href = '/#/influencer/signup';
    }

  })
  /*
  *
  *  Influencer Sign In
  *
  */
  .controller('influencerAccountSigninController', function($scope) {
    $scope.formData = {};
    $scope.submit = function(form) {};
  });

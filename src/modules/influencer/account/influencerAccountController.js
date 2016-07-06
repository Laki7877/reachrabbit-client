/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

//Load Social Profile
function loadSocialProfile(soPro, formData) {
  formData.socialAccounts[soPro.provider] = {
    id: soPro.data.id,
    token: soPro.data.token
  };

  if(!formData.email){
    formData.email = soPro.data.email;
  }

  if(!formData.profilePicture){
    formData.profilePicture = soPro.data.picture;
  }

  if(!formData.name){
    formData.name = soPro.data.name;　
  }

}

angular.module('app.influencer')
  .controller('influencerAccountSigninController', function($scope) {
    $scope.formData = {};
    $scope.submit = function(form) {
    };
  })
  .controller('influencerAccountSignupController', function($scope, $storage, $state, $mdDialog, $uploader, $auth, $mdToast, socialProfile) {
    $scope.formData = $scope.formData || { socialAccounts: {} };
    $scope.loadingImage = false;
    $scope.message = '';
    $scope.hideTitle = true;

   function authNOK(err) {
      if(err.data && err.data.display) {
        $mdDialog.show(
        $mdDialog.alert()
        .title(err.data.display.title + " (" +  err.data.exception_code + ")")
        .textContent(err.data.display.message)
        .ok('Got it!'));
      }
    }

    //Other functions
    $scope.linkedWith = function(key) {
      return key in $scope.formData.socialAccounts;
    };

    $scope.linkWith = function(key) {
      $auth.authenticate(key)
        .then(function(res) {
          loadSocialProfile({
            'provider': key,
            'data': res.data
          }, $scope.formData);

          $mdToast.show(
            $mdToast.simple()
              .textContent('Linked to ' + key + ' account')
              .position('top right' )
              .hideDelay(3000)
          );
        })
        .catch(authNOK);

    };

    // go back
    $scope.back = function(){
      $state.go('^.1');
       $scope.hideTitle = true;
    };
    // go next
    $scope.next = function() {
      $state.go('^.2');
      $scope.hideTitle = false;
    };

    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/register/influencer',
        data: $scope.formData
      }).then(function(data) {
        $scope.message = 'Please check your email';
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };

    $scope.upload = function(file) {
      $scope.loadingImage = true;
      $uploader.upload('/file', file)
        .then(function(data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data;
        });
    };

    loadSocialProfile(socialProfile, $scope.formData);
  })
  .controller('influencerAccountConfirmController', function($state, $stateParams, $api, $storage) {
    //confirm endpoint
    $api({
      method: 'POST',
      url: '/confirm',
      data: {
        token: $stateParams.q
      }
    }).then(function(data) {
      $storage.put('auth', data.token);
      $state.go('campaign'); //goto campaign list
    }).catch(function(err) {
      console.log(err);
    });
  });

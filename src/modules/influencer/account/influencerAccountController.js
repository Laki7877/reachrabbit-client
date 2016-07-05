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
  console.log(soPro);
  formData.socialAccounts[soPro.provider] = {
    id: soPro.data.id,
    token: soPro.data.token
  };

  if(!formData.email){
    formData.email = soPro.data.email;
  }

  if(!formData.profilePicture){
    formData.profilePicture = soPro.data.picture;
    console.log(formData)
  }

  if(!formData.name){
    formData.name = soPro.data.name;　
  }

}

angular.module('app.influencer')
  .controller('influencerAccountSigninController', function($scope) {
    $scope.formData = {};
    $scope.submit = function() {

    };
  })
  .controller('influencerAccountSignupController', function($scope, $storage, $state, $uploader, socialProfile) {
    $scope.formData = {
      socialAccounts: {}
    };

    $scope.loadingImage = false;

    // pass forward info
    $scope.submit = function() {
      $state.go('.detail', {
        data: $scope.formData
      });
    };

    $scope.upload = function(file) {
      $scope.loadingImage = true;
      $uploader.upload('/file_demo', file)
        .then(function(data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data.url;
        });
    };

    loadSocialProfile(socialProfile, $scope.formData);
  })
  .controller('influencerAccountSignupDetailController', function($scope, $api, $state, $auth, $stateParams,  $mdToast) {
    $scope.formData = $stateParams.data;
    $scope.message = '';

    //Other functions
    $scope.linkedWith = function(key) {
      return key in $scope.formData.socialAccounts;
    }

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
        .catch(function(err) {
          console.log(err);
        });

    }

    $scope.back = function(){
      $state.go('signup' , {
        data: $scope.formData
      });
    }

    $scope.submit = function() {
      return console.log(JSON.stringify($scope.formData));
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

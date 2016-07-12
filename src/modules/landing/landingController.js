/**
 * Landing page controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.2
 */
'use strict';
var loadSocialProfile = require('./socialProfile');

angular.module('app.landing')
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
  .controller('landingInfluencerController', function($scope, $window, $mdMedia, $auth, $mdDialog, $uibModal, $storage) {
    $scope.loadingTop = false;

    function authOK(res) {
      if(res.data.isLogin) {
        $storage.putAuth(res.data.token);
        $window.location.href= '/influencer#/profile';
      } else {
        $storage.put('profile-signup', {
          'provider': res.data.provider,
          'data': res.data
        });
        $window.location.href = '/#/influencer/signup';
      }
    }
    function authNOK(err) {
          console.log(err);
          if(err.data.display){
            $scope.loadingTop = false;
            console.log("showing alert");
            $mdDialog.show(
              $mdDialog.alert()
              .title(err.data.display.title + " (" +  err.data.exception_code + ")")
              .textContent(err.data.display.message)
              .ok('Got it!')
            );
          }
    }

    function showFbPageChooser(dataObject) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'partials/fb.pages.dialog1.tmpl.html',
          controller: function($scope, dataObject, $uibModalInstance, authOK){
              console.log(dataObject);
              $scope.pages = dataObject.accounts;
              $scope.choose = function(item){
                console.log("You picked", item);
                item.provider = 'facebook';
                //item.id is page ID
                item.pageId = item.id;
                delete item.id;
                var dd = _.extend(dataObject, item);
                authOK({
                  data: dd
                });
                $uibModalInstance.close();
              }
            },
          size: 'lg',
          resolve: {
              dataObject: function(){
                  return dataObject;
              },
              authOK: function(){
                return authOK;
              }
            }
        });

    };

    function authOK_FB(res) {
      //res.data is endpoint's object
        console.log(res.data);
      if(res.data.isLogin) {
        console.log(res.data);
        $storage.putAuth(res.data.token);
        $window.location.href= '/influencer#/profile';
      } else {
        showFbPageChooser(res.data);
      }
    }

    $scope.loginWithYT = function(){
      $scope.loadingTop = true;
      $auth.authenticate('google')
        .then(authOK)
        .catch(authNOK);

    }

    $scope.loginWithIG = function(){
      $scope.loadingTop = true;
      $auth.authenticate('instagram')
        .then(authOK)
        .catch(authNOK);
    }

    //Facebook flow OAuth is more
    //retarded (less standard)
    //we need to handle with more impl effort
		$scope.loginWithFB = function() {
      $scope.loadingTop = true;
			$auth.authenticate('facebook')
				.then(authOK_FB)
				.catch(authNOK);
		};
	})
  /*
  *
  *  Influencer Sign In
  *
  */
  .controller('influencerAccountSigninController', function($scope) {
    $scope.formData = {};
    $scope.submit = function(form) {};
  })
  /*
  *
  *  Influencer Sign Up
  *
  */
  .controller('influencerAccountSignupController', function($scope, $storage, $state, $api, $mdDialog, $uploader, $auth, $mdToast, socialProfile) {

    $scope.formData = $scope.formData || {
      socialAccounts: {},
      selectedTopics: []
    };
    $scope.loadingImage = false;
    $scope.message = '';
    $scope.hideTitle = true;

    $scope.topicExists = function(item, selected) {
      return selected.indexOf(item.categoryId) !== -1;
    }
    $scope.topics = []
    //get cat list
    $api({
      method: 'GET',
      url: '/data/categories'
    }).then(function(data) {
      $scope.topics = data;
    }).catch(function(err) {
      console.log(err);
    });


    $scope.topicDisabled = function(item, selected) {
      return selected.length >= 3 && !$scope.topicExists(item, selected)
    }
    $scope.topicToggle = function(item, selected) {
      if ($scope.topicDisabled(item, selected)) return;
      if ($scope.topicExists(item, selected)) {
        _.remove(selected, function(x) {
          return x == item.categoryId
        })
      } else {
        selected.push(item.categoryId)
      }
    }

    function authNOK(err) {
      if (err.data && err.data.display) {
        $mdDialog.show(
          $mdDialog.alert()
          .title(err.data.display.title + " (" + err.data.exception_code + ")")
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
          }, $api, $scope.formData);

          $mdToast.show(
            $mdToast.simple()
            .textContent('Linked to ' + key + ' account')
            .position('top right')
            .hideDelay(3000)
          );
        })
        .catch(authNOK);
    };

    // go back
    $scope.back = function() {
      $state.go('^.1');
    };
    // go next
    $scope.next = function() {
      $state.go('^.2');
    };

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

    loadSocialProfile(socialProfile, $api, $scope.formData);
  })
  /*
  *
  *  Brand Sign Up
  *
  */
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

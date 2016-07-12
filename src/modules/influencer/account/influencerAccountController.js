/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

//Load Social Profile
function loadSocialProfile(soPro,$api, formData) {

  console.log(soPro, 'soPro')
  formData.socialAccounts[soPro.provider] = {
    id: soPro.data.id,
    token: soPro.data.token
  };

  if (!formData.email) {
    formData.email = soPro.data.email;
  }

  if (!formData.profilePicture) {

    //Save as resource
    $api({
      method: 'POST',
      url: '/file/remote',
      data: {
        url: soPro.data.picture.url,
        mimetype: 'image/png'
      }
    }).then(function(data) {
      formData.profilePicture = data;
    }).catch(function(err) {
      console.log(err);
    });

  }

  if (!formData.name) {
    formData.name = soPro.data.name;　
  }

}

angular.module('app.influencer')
  .controller('influencerAccountConfirmController', function($scope) {
    $scope.formData = {};
  })
  /*
  * Influencer Profile
  *
  */
  .controller('influencerAccountProfileController', function($scope,$uploader, $auth, $mdToast, $mdDialog, $api) {
    //Hacky, will change after TODO: Friday
    document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    document.getElementsByTagName("body")[0].style.backgroundColor = "#ebebeb";

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

    $scope.topicExists = function(item, selected) {
      return selected.indexOf(item.id) !== -1;
    }

    $scope.topicDisabled = function(item, selected) {
      return selected.length >= 3 && !$scope.topicExists(item, selected)
    }
    $scope.topicToggle = function(item, selected) {
      if ($scope.topicDisabled(item, selected)) return;
      if ($scope.topicExists(item, selected)) {
        _.remove(selected, function(x) {
          return x == item.id
        })
      } else {
        selected.push(item.id)
      }
    }
    $scope.topics = [{
      name: "Travel",
      id: 1
    }, {
      name: "Beauty",
      id: 2
    }, {
      name: "Food",
      id: 3
    }, {
      name: "Cooking",
      id: 4
    }, {
      name: "Gaming",
      id: 5
    }, {
      name: "Gadget",
      id: 6
    }, {
      name: "Educational",
      id: 9
    }];


    //get user info
    $api({
      method: 'GET',
      url: '/me'
    }).then(function(data) {
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function(err) {
      console.log(err);
    });


    function authNOK(err) {
      if (err.data && err.data.display) {
        alert(err.data.display.message)
      }
    }

    //Other functions
    $scope.linkedWith = function(key) {
      return key in $scope.formData.socialAccounts;
    };

    $scope.linkWith = function(key) {
      $auth.authenticate(key)
        .then(function(res) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Linked to ' + key + ' account')
            .position('top right')
            .hideDelay(3000)
          );
        })
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
  .controller('influencerAccountSignupController', function($scope, $storage, $state, $api, $mdDialog, $uploader, $auth, $mdToast, socialProfile) {
    $scope.formData = $scope.formData || {
      socialAccounts: {},
      selectedTopics: []
    };
    $scope.loadingImage = false;
    $scope.message = '';
    $scope.hideTitle = true;

    $scope.topicExists = function(item, selected) {
      return selected.indexOf(item.id) !== -1;
    }

    $scope.topicDisabled = function(item, selected) {
      return selected.length >= 3 && !$scope.topicExists(item, selected)
    }
    $scope.topicToggle = function(item, selected) {
      if ($scope.topicDisabled(item, selected)) return;
      if ($scope.topicExists(item, selected)) {
        _.remove(selected, function(x) {
          return x == item.id
        })
      } else {
        selected.push(item.id)
      }
    }
    $scope.topics = [{
      name: "Travel",
      id: 1
    }, {
      name: "Beauty",
      id: 2
    }, {
      name: "Food",
      id: 3
    }, {
      name: "Cooking",
      id: 4
    }, {
      name: "Gaming",
      id: 5
    }, {
      name: "Gadget",
      id: 6
    }, {
      name: "Educational",
      id: 9
    }];



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
        $state.go('campaign');
        $storage.putAuth(data.token);
        $storage.remove('profile-signup');
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

    loadSocialProfile(socialProfile, $api, $scope.formData);
  });

/**
 * Landing page controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.landing')
  .controller('landingController', function($state) {
    $state.go('brand');
  })
	.controller('landingBrandController', function($scope, $window) {
    $scope.signup = function() {
      $window.location.href = '/brand#/signup';
    };
    $scope.signin = function() {
      $window.location.href = '/brand#/signin';
    };
	})
	.controller('landingInfluencerController', function($scope, $window, $mdMedia, $auth, $mdDialog, $storage) {
    $scope.loadingTop = false;

    function showFbPageChooser(dataObject) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $mdDialog.show({
        controller: function($scope, dataObject){
          console.log(dataObject)
          $scope.pages = dataObject.accounts;
        },
        locals: {
          dataObject: dataObject
        },
        templateUrl: 'fb.pages.dialog1.tmpl.html',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };


    function authOK(res) {
          if(res.data.isLogin) {
            $storage.put('auth', res.data.token);
            $window.location.href= '/influencer#/campaign';
          } else {
            $storage.put('profile-signup', {
              'provider': res.data.provider,
              'data': res.data
            });
            $window.location.href = '/influencer#/signup';
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
            .ok('Got it!'));
          }
    }

    function authOK_FB(res) {
      showFbPageChooser(res.data);
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
	});


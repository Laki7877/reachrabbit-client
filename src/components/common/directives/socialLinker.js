/**
 * Social Linker Pills
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.common')
  .directive('socialLinker', function($mdToast, $mdDialog, $api, $storage, $uibModal, $auth) {
    return {
      restrict: 'AE',
      scope: {
        model: '=ngModel', //dictionary model where key is social , ex {'instagram' : <profileObject> }
        accessor: '&?', //function that defines how to access the url of the model,
        onSuccess: '=?', //resolves with { user: UserObject, page: PageObject }
        onFail: '=?',
        onAlreadyLoggedIn: '=?'
      },
      templateUrl: 'templates/social-linker.html',
      link: function(scope, elem, attrs, form) {
        scope.linkedWith = function(key) {
          return key in scope.model;
        }
        scope.medium = []

        //get medium list
        $api({
          method: 'GET',
          url: '/data/medium'
        }).then(function(data) {
          scope.medium = data;
          console.log(scope.medium)
        }).catch(function(err) {
          console.error("Medium list fetch failure", err);
        });

        function showFbPageChooser(fbUser) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/social-linker-fb-pages.html',
            controller: function($scope, fbUser, $uibModalInstance) {
              console.log('fbUser', fbUser);
              $scope.pages = fbUser.accounts;
              //on user select page
              $scope.choose = function(page) {
                //end of facebook flow
                console.log("User did select page", page);

                $uibModalInstance.close();

                //assign model
                scope.model['facebook'] = {
                  socialId: fbUser.id,
                  token: fbUser.token,
                  mediaId: 'facebook',
                  pageId: page.id
                };

                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Linked to Facebook account')
                    .position('top right')
                    .hideDelay(3000)
                );

                if (scope.onSuccess) {
                  scope.onSuccess({
                    user: fbUser,
                    page: page,
                    provider: 'facebook',
                    modelBind: scope.model['facebook']
                  });
                }

              }
            },
            size: 'lg',
            resolve: {
              fbUser: function() {
                return fbUser;
              }
            }
          });

        };

        scope.linkWith = function(key) {
            $auth.authenticate(key)
              .then(function(res) {

                console.log('linkWith resolve', res);
                if(res.data.isLogin) {
                  $storage.putAuth(res.data.token);
                  if(scope.onAlreadyLoggedIn){
                    scope.onAlreadyLoggedIn(res.data);
                  }
                }

                if (key == 'facebook') {
                  //Facebook special case
                  //Flow not over yet
                  showFbPageChooser(res.data);
                } else {
                  $mdToast.show(
                    $mdToast.simple()
                    .textContent('Linked to ' + key + ' account')
                    .position('top right')
                    .hideDelay(3000)
                  );

                  //Other case, flow is over
                  //set social profile model
                  scope.model[key] = {
                    socialId: res.data.id,
                    token: res.data.token,
                    mediaId: key,
                    pageId: null
                  };

                  if (scope.onSuccess) {
                    scope.onSuccess({
                      user: res.data,
                      page: null,
                      provider: key,
                      modelBind: scope.model[key]
                    });
                  }
                }



              })
              .catch(function(err) {
                if (!err) return;

                //TODO replace with generic error handler
                if (err.data && err.data.display) {
                  $mdDialog.show(
                    $mdDialog.alert()
                    .title(err.data.display.title + " (" + err.data.exception_code + ")")
                    .textContent(err.data.display.message)
                    .ok('Got it!'));
                }
                console.warn(err);
                if (scope.onFail) scope.onFail(err);
              });
          } //linkWith



      }
    }
  });

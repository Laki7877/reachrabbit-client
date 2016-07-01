/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var signinSchema = require('./brandAccountSigninSchema');
var signupSchema = require('./brandAccountSignupSchema');

angular.module('app.brand')
	.controller('brandAccountSignupController', function($scope, $state, $api) {
    $scope.schema = signupSchema();

    $scope.submit = function(form) {

    };
	})
	.controller('brandAccountSigninController', function($scope, $state, $storage, $api) {
    $scope.schema = signinSchema();

    // on form submit
    $scope.submit = function(form) {
      $scope.$broadcast('schemaFormValidate', 'form');

      // validate form
      if(form.$valid) {
        // call api
        $api({
          method: 'POST',
          url: '/login',
          data: $scope.formData
        }).then(function(data) {
          $storage.putAuth(data.token);
          $state.go('campaign.list');
        }).catch(function(err) {
          console.error(err);
        });
      }
    };
	});

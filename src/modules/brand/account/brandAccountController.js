/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var signinSchema = require('./brandAccountSigninSchema');

angular.module('app.brand')
	.controller('brandAccountSignupController', function($scope, $state, $api) {
    $scope.formData = {};
    $scope.form = {};
    $scope.schema = signinSchema();

    // on form submit
    $scope.submit = function(form) {
      if(form.$valid) {
        $api({
          method: 'POST',
          url: '/register/brand',
          data: $scope.formData
        }).then(function(data) {
          $scope.message = 'Please check your email';
        }).catch(function(err) {
          $scope.message = err.message;
        });
      } else {
        $scope.broadcast('schemaFormValidate', 'form');
      }
    };
	})
	.controller('brandAccountSigninController', function($scope, $state, $storage, $api) {
    $scope.formData = {};
    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/login',
        data: $scope.formData
      }).then(function(data) {
        $storage.put('auth', data.token);
        $state.go('campaign.list');
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };
	});

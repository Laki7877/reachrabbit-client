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

  /**
   * Admin Sign In
   */
  .controller('adminAccountSigninController', function($scope, $api, $window) {
    $scope.formData = {};
    $scope.submit = function(form) {
      $api({
        method: 'POST',
        url: '/login/admin'
      })
      .then(function(data) {
        $storage.putAuth(data.token);
        $window.location.href="/admin";
      });
    };
  });

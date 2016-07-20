/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';
angular.module('app.brand')
  .controller('brandInfluencerListController', function($scope, $api) {
    $scope.users = [];
    $api({
      method: 'GET',
      url: '/users/influencer',
    })
    .then(function(data) {
      $scope.users = data.rows;
    });
  })
  .controller('brandInfluencerDetailController', function($scope, $api, $stateParams) {
    $scope.user = {};
    $api({
      method: 'GET',
      url: '/users/influencer/' + $stateParams.id
    })
    .then(function(data) {
      $scope.user = data;
    });
  });

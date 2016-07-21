/**
 * Brand submission controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
	.controller('brandCampaignSubmissionController', function($scope, $api, $stateParams) {
    $scope.formDataArray = [];
    $scope.formData = {};

    $api({
      method: 'GET',
      url: '/campaigns/' + $stateParams.campaignId
    }).then(function (data) {
      $scope.formData = data;
      $scope.formDataArray = [$scope.formData];
    }).catch(function (err) {
      console.error("cant get campaign data", err);
    });


	});

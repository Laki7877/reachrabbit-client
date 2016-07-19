/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

angular.module('app.influencer')
	.controller('influencerCampaignListController', function($scope, $api) {
    $scope.moderu = [{}, {}];
    $api({
        method: 'GET',
        url: '/campaigns'
      }).then(function(data) {
        console.log(data.rows);
      }).catch(function(err) {
        $scope.message = err.message;
      });

	});

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
    $scope.campaigns = [];
    $api({
        method: 'GET',
        url: '/campaigns',
        params: {
          status: 'open'
        }
      }).then(function(data) {
        $scope.campaigns = data.rows;
      }).catch(function(err) {
        $scope.message = err.message;
      });

	})
  .controller('influencerCampaignMyListController', function($scope, $api) {
    $scope.campaigns = [];
    $api({
        method: 'GET',
        url: '/mycampaigns'
      }).then(function(data) {
        $scope.campaigns = data.rows;
      }).catch(function(err) {
        $scope.message = err.message;
      });

  })
  .controller('influencerCampaignProductionDetailController', function($scope, $stateParams, $api, $state, $mdToast){
    $scope.campaigns = [];
    $scope.campaign = {};
    $scope.submission = {
      resources: []
    };
    $scope.proposal = {};

      $api({
        method: 'GET',
        url: '/campaigns/' + $stateParams.campaignId
      }).then(function(data) {
        $scope.campaigns = [data];
        $scope.campaign = data;
      }).catch(function(err) {
        $scope.message = err.message;
      });

      $api({
        method: 'GET',
        url: '/campaigns/' + $stateParams.campaignId + '/proposals'
      }).then(function(data) {
        $scope.proposal = data;
      }).catch(function(err) {
        $scope.message = err.message;
      });


      $scope.submitWork = function(submission){
        $api({
          method: 'POST',
          url: '/campaigns/' + $stateParams.campaignId + '/submissions',
          data: proposal
        }).then(function(data) {
          var el = document.getElementsByTagName("body")[0];
          $mdToast.show($mdToast.simple().textContent('Work submitted!')
          .position('top right').parent(el));
        }).catch(function(err) {
          $scope.message = err.message;
        });
      }
  })
  .controller('influencerCampaignDetailController', function($scope, $mdToast, $stateParams, $state, $api){
    $scope.campaigns = [];
    $scope.campaign = {};
    $scope.proposal = {
      resources: []
    };

    $api({
        method: 'GET',
        url: '/campaigns/' + $stateParams.campaignId
      }).then(function(data) {
        $scope.campaigns = [data];
        $scope.campaign = data;
      }).catch(function(err) {
        $scope.message = err.message;
      });


      $scope.applyCampaign = function(proposal){
        $api({
          method: 'POST',
          url: '/campaigns/' + $stateParams.campaignId + '/proposals',
          data: proposal
        }).then(function(data) {
          var el = document.getElementsByTagName("body")[0];
          $mdToast.show($mdToast.simple().textContent('Applied!')
          .position('top right').parent(el));
        }).catch(function(err) {
          $scope.message = err.message;
        });
      }
  });

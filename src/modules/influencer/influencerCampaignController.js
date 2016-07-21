/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

angular.module('app.influencer')
	.controller('influencerOpenCampaignListController', function($scope, $stateParams, $api,VirtualStatus, NcAlert) {
    $scope.campaigns = [];
    $scope.alert = new NcAlert();

    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $api({
        method: 'GET',
        url: '/campaigns',
        params: {
          status: 'open'
        }
      }).then(function(data) {
        $scope.campaigns = data.rows;
        $scope.campaigns.forEach(function(c){
          var mine = VirtualStatus.isApplied(c);
          //applied
          if(mine){
            c.virtualStatus = 'applied';
          }
        });

      }).catch(function(err) {
        $scope.message = err.message;
      });
	})
  .controller('influencerTransactionListController', function($scope, $state, $stateParams,  $api){
      console.log("Transaction loaded");
      $scope.transactions = [];
      $api({
        url: "/transactions",
        "method": "GET"
      }).then(function(data){
        $scope.transactions = data.rows;
      })
  })
  .controller('influencerMyCampaignListController', function($scope, $api) {
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
  .controller('influencerCampaignDetailController', function($scope, VirtualStatus, $storage, $stateParams, $state, $api){
    $scope.campaigns = [];
    $scope.proposals = [];

    $scope.campaign = {};

    $scope.proposal = {
      resources: []
    };
    $scope.submission = {
      resources: []
    };

    $scope.comments = [];

    $scope.isApplied = false;


    $api({
        method: 'GET',
        url: '/campaigns/' + $stateParams.campaignId
      }).then(function(data) {
        $scope.campaigns = [data];
        $scope.campaign = data;

        var mine = VirtualStatus.isApplied(data);
        //applied
        if(mine){
          $scope.campaign.status = 'applied';
          $scope.isApplied = true;
          if(mine.comment){
            $scope.comments.push(mine.comment);
          }
          $scope.proposal = mine;
          $scope.proposals = [mine];
        }

      }).catch(function(err) {
        $scope.message = err.message;
      });


      $scope.postProposal = function(proposal){
        proposal.status = 'wait for review';
        $api({
          method: 'POST',
          url: '/campaigns/' + $stateParams.campaignId + '/proposals',
          data: proposal
        }).then(function(data) {
          $state.go('open-campaign', { alert: 'Applied to campaign'});
        }).catch(function(err) {
          $scope.message = err.message;
        });
      }

      $scope.submitWork = function(submission){
        $api({
          method: 'POST',
          url: '/campaigns/' + $stateParams.campaignId + '/submissions',
          data: submission
        }).then(function(data) {
          $state.go('open-campaign', {alert: "Your work has been submitted and is being reviewed."});
        }).catch(function(err) {
          $scope.message = err.message;
        });
      }

  });

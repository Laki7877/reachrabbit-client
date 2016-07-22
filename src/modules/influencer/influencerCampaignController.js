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
  .controller('influencerMyCampaignListController', function($scope, NcAlert, $stateParams, $api) {
    $scope.campaigns = [];
    $scope.alert = new NcAlert();
    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $scope.getMyLatestProposal = function(card){
      return card.campaignProposals[0];
    }

    $scope.getMyLatestSubmission = function(card){
      return card.campaignSubmissions[0];
    }

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

    $scope.needRevision = function(){
      if($scope.proposal.status == 'need revision'){
        return true;
      }
      return false;
    }

    $api({
        method: 'GET',
        url: '/campaigns/' + $stateParams.campaignId
      }).then(function(data) {
        $scope.campaigns = [data];
        $scope.campaign = data;

        var mine = VirtualStatus.isApplied(data);
        console.log('mine', mine);
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
          if(data.proposalId){
            $state.go('my-campaign', { alert: '<strong>Success</strong> - Proposal updated.'});
          }else{
            $state.go('open-campaign', { alert: '<strong>Success</strong> - Applied to Campaign.'});
          }
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

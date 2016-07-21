/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.brand')
  .controller('brandTransactionListController', function($scope, $state, $stateParams,  $api){
      console.log("Transaction loaded");
      $scope.transactions = [];
      $api({
        url: "/transactions",
        "method": "GET"
      }).then(function(data){
        $scope.transactions = data.rows;
      })
  })
	.controller('brandCampaignPaymentController', function($scope, $state, $stateParams,  $api, campaign){
		$scope.campaign = campaign;
    $scope.paymentObject = {};
		$scope.campaign.selectedProposals = _.compact($scope.campaign.campaignProposals.map(function(o){ if(o.isSelected) return o; }));

    $scope.sumFee = $scope.campaign.selectedProposals.reduce(function(total, num){
      return total + num.proposePrice;
    },0);

		$scope.goBack = function() {
			$state.go('^');
		}

    $scope.readyToPay = function(){
      console.log('readyToPay')
      $api({
        method: "POST",
        url: "/campaigns/" + $stateParams.campaignId + '/transactions'
      }).then(function(success){
        alert("Ready!");
      })
    }

    $scope.sendSlip = function(p){
      $api({
        method: "PUT",
        url: "/campaigns/" + $stateParams.campaignId + '/transactions',
        data: p
      }).then(function(success){
        alert("Done!");
      })
    }

	})
	.controller('brandCampaignProposalDetailController', function ($scope, $mdToast, $state, $api, $window, $uibModal, $stateParams) {
		$scope.goBack = function () {
			//go back
			$state.go('^');
		}
		if (!$stateParams.user) {
			return alert("You're not supposed to be here bitch.");
		}
    console.log($stateParams.user)

		$scope.proposal = $stateParams.user.influencer.campaignProposals[0];
		$scope.influencers = [$stateParams.user];

		$scope.askForRevision = function (proposal) {
			var tmpl = 'partials/modal-revision-proposal.html';
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: tmpl,
				controller: function ($scope, $api, $uibModalInstance, proposal) {
					$scope.formData = proposal;
					$scope.saveComment = function () {
						console.log("Saving")
						$api({
							url: '/campaigns/' + proposal.campaignId + '/proposals/' + proposal.proposalId,
							method: 'PUT',
							data: $scope.formData
						}).then(function (data) {
							$uibModalInstance.close(data);
						}).catch(function (err) {
							alert("Can't save! Nien.")
						});
					}
				},
				size: 'lg',
				resolve: {
					'proposal': function () {
						return proposal;
					}
				}
			});

			modalInstance.result.then(function (data) {
				console.log(data);
				var el = document.getElementsByTagName("body")[0];
				$mdToast.show($mdToast.simple().textContent('Message Sent!')
					.position('top right').parent(el));
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
			$api({
				method: 'PUT',
				url: '/campaigns/' + $stateParams.campaignId + '/proposals/' + proposal.proposalId,
				data: _.extend({}, proposal, {status: 'need revision'})
			})
			.then(function(data) {
				$scope.proposal = data;
			});
		}

		$scope.selectProposal = function (proposal) {
			$api({
				method: 'PUT',
				url: '/campaigns/' + $stateParams.campaignId + '/proposals/' + proposal.proposalId,
				data: _.extend({}, proposal, {isSelected: true})
			})
			.then(function(data) {
				$scope.proposal = data;
			});
		}

		$scope.unselectProposal = function (proposal) {
			$api({
				method: 'PUT',
				url: '/campaigns/' + $stateParams.campaignId + '/proposals/' + proposal.proposalId,
				data: _.extend({}, proposal, {status: 'wait for review'})
			})
			.then(function(data) {
				$scope.proposal = data;
			});
		}

	})
	.controller('brandCampaignDetailOpenController', function ($scope, $api, $state, $stateParams) {
		$scope.formData = {};
		$scope.formDataArray = [];
		$scope.proposals = [];
		if (!$stateParams.campaignId) {
			alert("Fuk you");
		}

		$scope.reviewAndPay = function(){
			$state.go('campaign-detail-open.detail.pay', { campaign: $scope.formData });
		}

		$api({
			method: 'GET',
			url: '/campaigns/' + $stateParams.campaignId
		}).then(function (data) {
			$scope.formData = data;
			$scope.formDataArray = [$scope.formData];
		}).catch(function (err) {
			console.error("cant get campaign data", err);
		});

		$api({
			method: 'GET',
			url: '/campaigns/' + $stateParams.campaignId + '/proposals'
		}).then(function (data) {
			$scope.proposals = data.rows;
		}).catch(function (err) {
			console.error("can't get proposals", err);
		});

	})
	.controller('brandCampaignDetailDraftController', function ($scope, $api, $stateParams) {
		var method = 'POST';
		var url = '/campaigns';

		$scope.formData = {
			status: 'draft',
			resources: [],
			media: []
		};

		if ($stateParams.campaignId) {
			$api({
				method: 'GET',
				url: '/campaigns/' + $stateParams.campaignId
			}).then(function (data) {
				$scope.formData = data;
				method = 'PUT';
				url = url + '/' + $stateParams.campaignId;
			}).catch(function (err) {
				console.error("bad stuff happened", err);
			});
		}

		function save() {
			$api({
				method: method,
				url: url,
				data: $scope.formData
			}).then(function (data) {
				alert("Done")
			}).catch(function (err) {
				console.error("bad stuff happened", err);
			});
		}

		$scope.saveDraft = function () {
			console.log("Saving as Draft")
			save();
		}

		$scope.savePublish = function () {
			$scope.formData.status = 'open';

			console.log("Saving as Publish")
			save();
		}

	})
	.controller('brandCampaignListController', function ($scope, $api) {
		$scope.campaigns = [];

		$api({
			method: 'GET',
			url: '/campaigns'
		}).then(function (data) {
			$scope.campaigns = data;
		});
	});

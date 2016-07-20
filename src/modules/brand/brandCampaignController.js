/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.brand')
	.controller('brandCampaignProposalDetailController', function ($scope, $state, $api, $window, $uibModal, $stateParams) {
		$scope.goBack = function () {
			//go back
			$state.go('^');
		}
		if (!$stateParams.proposal) {
			return alert("You're not supposed to be here bitch.");
		}

		$scope.proposal = $stateParams.proposal;
		$scope.influencers = [$stateParams.proposal.influencer];

		$scope.askForRevision = function (proposal) {
			var tmpl = 'partials/modal-revision-proposal.html';
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: tmpl,
				controller: function($scope, $api, proposal){
					$scope.formData = proposal;
					$scope.saveComment = function(){
						console.log("Saving")
						$api({
							url: '/campaigns/' + proposal.proposalId + '/proposals',
							method: 'POST',
							data: $scope.formData
						}).then(function(data){
							console.log(data);
						})
					}
				},
				size: 'lg',
				resolve: {
					'proposal': function(){
						return proposal;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});

		}

		$scope.selectProposal = function (proposalId) {

		}

	})
	.controller('brandCampaignDetailOpenController', function ($scope, $api, $state, $stateParams) {
		$scope.formData = {};
		$scope.formDataArray = [];
		$scope.proposals = [];
		if (!$stateParams.campaignId) {
			alert("Fuk you");
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

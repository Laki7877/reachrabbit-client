/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.brand')
	.controller('brandCampaignProposalController', function ($scope, $api, $stateParams) {
		$scope.formData = {};
		$scope.formDataArray = [];
		$scope.proposals = [];
		if (!$stateParams.id) {
			alert("Fuk you");
		}
		$api({
			method: 'GET',
			url: '/campaigns/' + $stateParams.id
		}).then(function (data) {
			$scope.formData = data;
			$scope.formDataArray = [$scope.formData];
		}).catch(function (err) {
			console.error("cant get campaign data", err);
		});

		$api({
			method: 'GET',
			url: '/campaigns/' + $stateParams.id + '/proposals'
		}).then(function (data) {
			$scope.proposals = data;
		}).catch(function (err) {
			console.error("can't get proposals", err);
		});


		
	})
	.controller('brandCampaignDetailController', function ($scope, $api, $stateParams) {
		var method = 'POST';
		var url = '/campaigns';

		$scope.formData = {
			status: 'draft',
			resources: [],
			media: []
		};

		if ($stateParams.id) {
			$api({
				method: 'GET',
				url: '/campaigns/' + $stateParams.id
			}).then(function (data) {
				$scope.formData = data;
				method = 'PUT';
				url = url + '/' + $stateParams.id;
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

/**
 * Brand submission controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
  .controller('brandCampaignSubmissionDetailController', function($scope, $uibModal, NcAlert,$state, $api, $stateParams) {
    $scope.influencerArray = [];
    $scope.formData = {};
    $scope.alert = new NcAlert();

    $api({
      method: 'GET',
      url: '/submissions/' + $stateParams.submissionId
    }).then(function (data) {
      $scope.formData = data;
      $scope.influencerArray = [$scope.formData.influencer];
    }).catch(function (err) {
      console.error("cant get campaign data", err);
    });

    $scope.waitForPost = function(submission){
      var tmpl = 'partials/modal-approve-submission.html';
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: tmpl,
        controller: function ($scope, $api, $uibModalInstance,  alert, submission) {
          $scope.formData = submission;

          $scope.saveComment = function () {
            $scope.formData.status = "wait for post";
            $api({
              url: '/campaigns/' + submission.campaignId + '/submissions/' + submission.submissionId,
              method: 'PUT',
              data: $scope.formData
            }).then(function (data) {
              $uibModalInstance.close(data);
            }).catch(function (err) {
              $uibModalInstance.dismiss(err);
            });
          }
        },
        size: 'lg',
        resolve: {
          'submission': function () {
            return submission;
          },
          'alert': function(){
            return $scope.alert;
          }
        }
      });

      modalInstance.result.then(function (data) {
        $state.go("campaign-list.production", { alert: 'Submission approved.'});
      }, function (err) {
        console.log('Modal dismissed at: ' + new Date());
        if(err){
          $scope.alert.error(err.message);
        }
      });
    }

    $scope.askForRevision = function (submission) {
      var tmpl = 'partials/modal-revision-proposal.html';
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: tmpl,
        controller: function ($scope, $api, $uibModalInstance,  alert, submission) {
          $scope.formData = submission;

          $scope.saveComment = function () {
            $scope.formData.status = "need revision";
            $api({
              url: '/campaigns/' + submission.campaignId + '/submissions/' + submission.submissionId,
              method: 'PUT',
              data: $scope.formData
            }).then(function (data) {
              $uibModalInstance.close(data);
            }).catch(function (err) {
              $uibModalInstance.dismiss(err);
            });
          }
        },
        size: 'lg',
        resolve: {
          'submission': function () {
            return submission;
          },
          'alert': function(){
            return $scope.alert;
          }
        }
      });

      modalInstance.result.then(function (data) {
        $state.go("campaign-list.production", { alert: 'Revision requested.'});
      }, function (err) {
        console.log('Modal dismissed at: ' + new Date());
        if(err){
          $scope.alert.error(err.message);
        }
      });
    }

  })
	.controller('brandCampaignSubmissionListController', function($scope, $api, NcAlert, $stateParams) {
    $scope.formDataArray = [];
    $scope.alert = new NcAlert();
    $scope.formData = {};
    $scope.submissions = [];

    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $api({
      method: "GET",
      url: '/campaigns/' + $stateParams.campaignId + "/submissions"
    }).then(function(data){
      $scope.submissions = data.rows;
    }).catch(function(err){
      $scope.alert.error("Can't get submissions data");
    });

    $api({
      method: 'GET',
      url: '/campaigns/' + $stateParams.campaignId
    }).then(function (data) {
      $scope.formData = data;
      $scope.formDataArray = [$scope.formData];
    }).catch(function (err) {
      console.error("cant get campaign data", err);
      $scope.alert.error("Can't get campaign data");
    });


	});

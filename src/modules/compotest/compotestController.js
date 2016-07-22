/**
 * Component Test controllers
 *
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.compotest')
  .controller('compotestController', function($scope, $api, $storage, admin, $window) {
    $api({
      method: 'GET',
      url: '/transactions?limit=100'
    })
    .then(function(results) {
      $scope.payments = results.rows;
    });

    $api({
      method: 'GET',
      url: '/submissions?limit=100'
    })
    .then(function(results) {
      $scope.submissions = results.rows;
    });

    $api({
      method: 'GET',
      url: '/campaigns?limit=100'
    })
    .then(function(results) {
      $scope.campaigns = results.rows;
    });

    // confirm payment
    $scope.confirmPayment = function(row) {
      // row should be campaign
      $api({
        method: 'POST',
        url: '/campaigns/' + row.campaignId + '/transactions/confirm'
      })
      .then(function(result) {
          $window.location.reload();
      });
    }

    // select submission
    $scope.selectSubmission = function(row) {
      $api({
        method: 'GET',
        url: '/submissions/' + row.submissionId
      })
      .then(function(result) {
        
      })
    };
    $scope.approveSubmission = function(row) {
      $api({
        method: 'PUT',
        url: '/submissions/' + row.submissionId + '/proofs',
        data: {
          comment: $scope.submissionComment
        }
      })
      .then(function(result) {
        $window.location.reload();
      });
    };

  })
  .controller('compotestVideoPlayerController', function() {

  });


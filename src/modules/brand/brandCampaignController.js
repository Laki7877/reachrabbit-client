/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
  .controller('brandCampaignCreateController', function($scope, $api) {
    $scope.formData = {
      resource: []
    };

    function save() {
      $api({
        method: 'POST',
        url: '/campaigns',
        data: $scope.formData
      }).then(function(data) {
        alert("Done")
      }).catch(function(err) {
        console.error("bad stuff happened", err);
      });
    }

    $scope.saveDraft = function(){
      console.log("Saving as Draft")
      save();
    }

  })
  .controller('brandCampaignListController', function($scope, $api) {

  });

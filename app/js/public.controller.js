require('./common.service');

angular.module('reachRabbitApp.public.controller', ['reachRabbitApp.common.service'])
    .controller('PublicCampaignController', function ($scope,$stateParams, PublicService) {
        $scope.campaignNee = null;
        PublicService.getCampaign($stateParams.campaignId).then(function(x){
            $scope.campaignNee = x.data;
        });
    });
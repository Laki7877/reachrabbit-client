angular.module('reachRabbitApp.public.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('public-campaign-detail', {
                url: "/public-campaign-detail/:campaignId",
                templateUrl: "view/public-campaign-detail.html",
                controller: 'PublicCampaignController'
            });
    }]);

angular.module('reachRabbitApp.influencer.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        /* Influencer */
        $stateProvider
            .state('influencer-campaign-list', {
                url: '/influencer-campaign-list',
                templateUrl: 'view/influencer-campaign-list.html',
                controller: 'InfluencerCampaignListController'
            })
            .state('influencer-campaign-detail', {
                url: '/influencer-campaign-detail/:campaignId?showDialog',
                templateUrl: 'view/influencer-campaign-detail.html',
                controller: 'InfluencerCampaignDetailController'
            })
            .state('influencer-profile', {
                url: '/influencer-profile?showVerify',
                templateUrl: 'view/influencer-profile.html',
                controller: 'InfluencerProfileController'
            })
            .state('influencer-profile-published', {
                url: '/influencer-profile-published?showToolbar',
                templateUrl: 'view/influencer-profile-published.html',
                controller: 'InfluencerProfileController'
            })
            .state('influencer-inbox', {
                url: '/influencer-inbox/:status?',
                templateUrl: 'view/influencer-inbox.html',
                controller: 'InfluencerInboxController'
            })
            .state('influencer-workroom', {
                url: '/influencer-workroom/:proposalId',
                templateUrl: 'view/influencer-workroom.html',
                controller: 'WorkroomController'
            })
            .state('influencer-brand-profile', {
                url: '/influencer-brand-profile/:brandId?proposalId',
                templateUrl: 'view/influencer-brand-profile.html',
                controller: 'BrandProfilePortfolioController',
                params: {
                    proposalId: null
                }
            })
            .state('influencer-payout-detail', {
                url: '/influencer-payout-detail/:walletId',
                templateUrl: 'view/influencer-payout-detail.html',
                controller: 'PayoutDetailController'
            })
            .state('influencer-payout-history', {
                url: '/influencer-payout-history',
                templateUrl: 'view/influencer-payout-history.html',
                controller: 'PayoutHistoryController'
            })
            .state('influencer-wallet', {
                url: '/influencer-wallet',
                templateUrl: 'view/influencer-wallet.html',
                controller: 'WalletController'
            })
            .state('public-campaign-detail', {
                url: "/public-campaign-detail/:campaignId",
                templateUrl: "view/public-campaign-detail.html",
                controller: 'PublicCampaignController'
            });


        //TODO: Campaign-detail

    }]);
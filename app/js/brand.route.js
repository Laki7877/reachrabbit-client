angular.module('reachRabbitApp.brand.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        var stateProvider = {
            state: function(state, config) {
                config.resolve = _.extend({}, config.resolve, {
                    User: ['AccountService', function(AccountService) {
                        return AccountService.getProfile();
                    }]
                });
                $stateProvider.state(state, config);
                return stateProvider;
            }
        };
        stateProvider
            .state('seed-page', {
                url: '/seed-page',
                templateUrl: 'view/_seed-page.html',
                controller: 'EmptyController'
            })
            .state('brand-campaign-list', {
                url: '/brand-campaign-list',
                templateUrl: 'view/brand-campaign-list.html',
                controller: 'CampaignListController'
            })
            .state('brand-campaign-detail-draft', {
                url: '/brand-campaign-detail-draft/:campaignId?',
                templateUrl: 'view/brand-campaign-detail-draft.html',
                controller: 'CampaignDetailController'
            })
            .state('brand-campaign-detail-edit', {
                url: '/brand-campaign-detail-edit/:campaignId',
                templateUrl: 'view/brand-campaign-detail-draft.html',
                controller: 'CampaignDetailController',
                params: {
                    editOpenState: true
                }
            })
            .state('brand-campaign-detail-example', {
                url: '/brand-campaign-detail-example/:exampleId',
                templateUrl: 'view/brand-campaign-detail-example.html',
                controller: 'CampaignExampleController'
            })
            .state('brand-campaign-detail-published', {
                url: '/brand-campaign-detail-published/:campaignId',
                templateUrl: 'view/brand-campaign-detail-published.html',
                controller: 'CampaignDetailController',
                params: {
                    alert: null,
                }
            })
            .state('brand-profile', {
                url: '/brand-profile',
                templateUrl: 'view/brand-profile.html',
                controller: 'BrandProfileController'
            })
            .state('brand-inbox', {
                url: '/brand-inbox/:status?',
                templateUrl: 'view/brand-inbox.html',
                controller: 'BrandInboxController'
            })
            .state('brand-workroom', {
                url: '/brand-workroom/:proposalId',
                templateUrl: 'view/brand-workroom.html',
                controller: 'WorkroomController'
            })
            .state('brand-influencer-profile', {
                url: '/brand-influencer-profile/:influencerId?proposalId',
                templateUrl: 'view/brand-influencer-profile.html',
                controller: 'InfluencerProfilePortfolioController',
                params: {
                    proposalId: null
                }
            })
            .state('brand-cart', {
                url: '/brand-cart',
                templateUrl: 'view/brand-cart.html',
                controller: 'CartController'
            })
            .state('brand-transaction-history', {
                url: '/brand-transaction-history',
                templateUrl: 'view/brand-transaction-history.html',
                controller: 'TransactionHistoryController'
            })
            .state('brand-transaction-detail', {
                url: '/brand-transaction-detail/:cartId',
                templateUrl: 'view/brand-transaction-detail.html',
                controller: 'TransactionDetailController'
            })
            .state('brand-dashboard', {
                url: '/brand-dashboard/:campaignId',
                templateUrl: 'view/brand-dashboard.html',
                controller: 'CampaignDashboardController'
            });

    }]);

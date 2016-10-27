angular.module('reachRabbitApp.admin.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
            .state('admin-transaction-history', {
                url: '/admin-transaction-history',
                templateUrl: 'view/admin-transaction-history.html',
                controller: 'AdminTransactionHistoryController'
            })
            .state('admin-transaction-detail', {
                url: '/admin-transaction-detail/:cartId',
                templateUrl: 'view/admin-transaction-detail.html',
                controller: 'TransactionDetailController'
            })
            .state('admin-payout-history', {
                url: '/admin-payout-history',
                templateUrl: 'view/admin-payout-history.html',
                controller: 'PayoutHistoryController'
            })
            .state('admin-payout-detail', {
                url: '/admin-payout-detail/:walletId',
                templateUrl: 'view/admin-payout-detail.html',
                controller: 'PayoutDetailController'
            })
            .state('admin-campaign-list', {
                url: '/admin-campaign-list',
                templateUrl: 'view/admin-campaign-list.html',
                controller: 'AdminCampaignListController'
            })
            .state('admin-campaign-detail', {
                url: '/admin-campaign-detail/:campaignId',
                templateUrl: 'view/admin-campaign-detail.html',
                controller: 'AdminCampaignDetailController'
            })
            .state('admin-ig-reloader', {
                url: '/admin-ig-reloader',
                templateUrl: 'view/admin-ig-reloader.html',
                controller: 'EmptyController'
            })
            .state('admin-inbox', {
                url: '/admin-inbox/:status?',
                templateUrl: 'view/admin-inbox.html',
                controller: 'AdminInboxController',
                resolve: {
                    authenticate: function ($q, UserProfile) {
                        return $q(function (defer, reject) {
                            if (UserProfile.get().role !== "Admin") {
                                reject();
                            } else {
                                defer();
                            }
                        });
                    }
                }
            })
            .state('admin-workroom', {
                url: '/admin-workroom/:proposalId',
                templateUrl: 'view/admin-workroom.html',
                controller: 'AdminWorkroomController'
            })
            .state('admin-dashboard', {
                url: '/admin-dashboard/:campaignId',
                templateUrl: 'view/admin-dashboard.html',
                controller: 'CampaignDashboardController'
            })
            .state('admin-brand-detail', {
                url: '/admin-brand-detail/:userId',
                templateUrl: 'view/admin-brand-detail.html',
                controller: 'AdminUserDetailController'
            })
            .state('admin-influencer-detail', {
                url: '/admin-influencer-detail/:userId',
                templateUrl: 'view/admin-influencer-detail.html',
                controller: 'AdminUserDetailController'
            })
            .state('admin-brand-list', {
                url: '/admin-brand-list',
                templateUrl: 'view/admin-brand-list.html',
                controller: 'AdminBrandListController'
            })
            .state('admin-influencer-list', {
                url: '/admin-influencer-list',
                templateUrl: 'view/admin-influencer-list.html',
                controller: 'AdminInfluencerListController'
            })
            .state('admin-referral-code-list', {
                url: '/admin-referral-code-list',
                templateUrl: 'view/admin-referral-code-list.html',
                controller: 'AdminReferralCodeListController'
            })
            .state('admin-referral-payment-list', {
                url: '/admin-referral-payment-list',
                templateUrl: 'view/admin-referral-payment-list.html',
                controller: 'AdminReferralPaymentListController'
            });
    }]);
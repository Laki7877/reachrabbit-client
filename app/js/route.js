/**
 * Routes
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S04E01
 */
/* jshint node: true */
'use strict';


angular.module('reachRabbitApp.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'view/404.html',
                controller: 'EmptyController'
            })
            .state('405', {
                url: '/405',
                templateUrl: 'view/405.html',
                controller: 'EmptyController'
            });

        $urlRouterProvider.otherwise("404");

    }]);

angular.module('reachRabbitApp.admin.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
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
            .state('admin-payout-detail',{
                url: '/admin-payout-detail/:walletId',
                templateUrl: 'view/admin-payout-detail.html',
                controller: 'PayoutDetailController'
            })
            .state('admin-campaign-list',{
                url: '/admin-campaign-list',
                templateUrl: 'view/admin-campaign-list.html',
                controller: 'AdminCampaignListController'
            })
            .state('admin-campaign-detail',{
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
                controller: 'AdminInboxController'
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

angular.module('reachRabbitApp.brand.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        /* Brands */
        $stateProvider
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

angular.module('reachRabbitApp.influencer.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        /* Influencer */
        $stateProvider
            .state('influencer-campaign-list', {
                url: '/influencer-campaign-list',
                templateUrl: 'view/influencer-campaign-list.html',
                controller: 'InfluencerCampaignListController'
            })
            .state('influencer-campaign-detail', {
                url: '/influencer-campaign-detail/:campaignId',
                templateUrl: 'view/influencer-campaign-detail.html',
                controller: 'InfluencerCampaignDetailController'
            })
            .state('influencer-profile', {
                url: '/influencer-profile',
                templateUrl: 'view/influencer-profile.html',
                controller: 'InfluencerProfileController'
            })
            .state('influencer-profile-published', {
                url: '/influencer-profile-published?showToolbar&showVerify',
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

angular.module('reachRabbitApp.portal.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('admin-login', {
                url: "/admin-login",
                templateUrl: "view/admin-login.html",
                controller: 'AdminSigninController'
            })
            .state('brand-login', {
                url: "/brand-login",
                templateUrl: "view/brand-login.html",
                controller: 'BrandSigninController'
            })
            .state('brand-signup', {
                url: "/brand-signup",
                templateUrl: "view/brand-signup.html",
                controller: 'BrandSignupController'
            })
            .state('influencer-portal', {
                url: "/influencer-portal?ref",
                templateUrl: "view/influencer-portal.html",
                controller: 'InfluencerPortalController',
                params: { alert: null }
            })
            .state('influencer-signup-select-page', {
                url: "/influencer-signup-select-page?ref",
                templateUrl: 'view/influencer-signup-select-page.html',
                controller: 'InfluencerFacebookPageSelectionController',
                params: { authData: null, fromState: null}
            })
            .state('influencer-signup-confirmation', {
                url: '/influencer-signup-confirmation?ref',
                templateUrl: 'view/influencer-signup-confirmation.html',
                controller: 'InfluencerSignUpController',
                params: { authData: null }
            })
            .state('influencer-signup-email', {
                url: '/influencer-signup-email?ref',
                templateUrl: 'view/influencer-signup-email.html',
                controller: 'InfluencerSignUpEmailController'
            })
            .state('influencer-login', {
                url: '/influencer-login',
                templateUrl: 'view/influencer-login.html',
                controller: 'InfluencerSigninController'
            })
            .state('influencer-god-login', {
                url: '/influencer-god-login',
                templateUrl: 'view/influencer-god-login.html',
                controller: 'InfluencerJesusController'
            });


    }]);

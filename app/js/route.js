/**
 * Routes
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S04E01
 */
/* jshint node: true */
'use strict';


angular.module('myApp.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'view/404.html',
                controller: 'EmptyController'
            });
        $urlRouterProvider.otherwise("404");

    }]);


angular.module('myApp.brand.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        /* Brands */
        $stateProvider
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
            .state('brand-campaign-detail-example', {
                url: '/brand-campaign-detail-example/:exampleId',
                templateUrl: 'view/brand-campaign-detail-example.html',
                controller: 'CampaignExampleController'
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
                url: '/brand-influencer-profile/:influencerId',
                templateUrl: 'view/brand-influencer-profile.html',
                controller: 'BrandInfluencerProfile'
            });

    }]);

angular.module('myApp.influencer.routes', ['ui.router'])
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
                url: '/influencer-brand-profile/:brandId',
                templateUrl: 'view/influencer-brand-profile.html',
                controller: 'InfluencerBrandProfile'
            });

        //TODO: Campaign-detail

    }]);


angular.module('myApp.portal.routes', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
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
                url: "/influencer-portal",
                templateUrl: "view/influencer-portal.html",
                controller: 'InfluencerPortalController',
                params: { alert: null }
            })
            .state('influencer-signup-select-page', {
                url: "/influencer-signup-select-page",
                templateUrl: 'view/influencer-signup-select-page.html',
                controller: 'InfluencerFacebookPageSelectionController',
                params: { authData: null, fromState: null }
            })
            .state('influencer-signup-confirmation', {
                url: '/influencer-signup-confirmation',
                templateUrl: 'view/influencer-signup-confirmation.html',
                controller: 'InfluencerSignUpController',
                params: { authData: null }
            })
            .state('influencer-god-login', {
                url: '/influencer-god-login',
                templateUrl: 'view/influencer-god-login.html',
                controller: 'InfluencerJesusController'
            });


    }]);
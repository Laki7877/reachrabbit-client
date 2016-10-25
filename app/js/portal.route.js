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
                params: { authData: null, fromState: null, bounce_route: null}
            })
            .state('influencer-signup-confirmation', {
                url: '/influencer-signup-confirmation?ref',
                templateUrl: 'view/influencer-signup-confirmation.html',
                controller: 'InfluencerSignUpController',
                params: { authData: null, bounce_route: null}
            })
            .state('influencer-signup-email', {
                url: '/influencer-signup-email?ref',
                templateUrl: 'view/influencer-signup-email.html',
                controller: 'InfluencerSignUpEmailController',
                params: { bounce_route: null}
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

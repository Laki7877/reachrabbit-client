angular.module('reachRabbitApp.common.routes', ['ui.router'])
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



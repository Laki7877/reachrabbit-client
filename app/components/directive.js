'use strict';

angular.module('myApp.directives', [])
.directive('testBox', [function () {
        return {
            restrict: 'EA',
            scope: false,
            templateUrl: 'components/templates/testbox.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
}])

angular.module('myApp.directives', [])
.directive('cardCampaignListItem', [function () {
        console.log;
        return {
            restrict: 'EA',
            scope: {campaign:'='},
            templateUrl: 'components/templates/card-campaign-list-item.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
}])

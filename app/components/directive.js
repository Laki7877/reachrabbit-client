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

.directive('alertBox', [function () {
        return {
            restrict: 'EA',
            templateUrl: 'components/templates/alertbox.html',
            scope: {
              message: "@message",
              type: "@type"
            }
        };
}])

.directive('cardCampaignListItem', [function () {
        return {
            restrict: 'EA',
            scope: {campaign:'='},
            templateUrl: 'components/templates/card-campaign-list-item.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
}])

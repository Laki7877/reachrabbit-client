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
            templateUrl: function(elem, attr){
                //Specify alertbox-success, alertbox-failure, alertbox-info etc.
                return 'components/templates/alertbox-' + attr.type + '.html';
            },
            scope: {
              message: "@message"
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

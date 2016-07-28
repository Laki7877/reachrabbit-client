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

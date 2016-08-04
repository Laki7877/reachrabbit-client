/* jshint node: true */
'use strict';

angular.module('myApp.directives', [])

.directive('testBox', [function () {
        return {
            restrict: 'EA',
            scope: false,
            templateUrl: 'components/templates/testbox.html',
            link: function (scope, element, attrs, ctrl, transclude) {
                //this fucntion gets calld when template is loaded
                
            }
        };
}])

.directive('alertBox', [function () {
        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: function(elem, attr){
                //Specify alertbox-success, alertbox-failure, alertbox-info etc.
                return 'components/templates/alertbox.html';
            },
            scope: {
              type: "@type",
              show: '=?showOn'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                //this fucntion gets calld when template is loaded
                if(!scope.show){
                    scope.show = false;
                }

                scope.close = function(){
                    scope.show = false;
                };
            }
        };
}])

.directive('cardCampaignHeader', [function () {
        return {
            restrict: 'EA',
            scope: {campaign:'='},
            templateUrl: 'components/templates/card-campaign-header.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
}])

.directive('cardCampaignListItem', [function () {
        return {
            restrict: 'EA',
            scope: {
              campaign:'=',
              linkTo:'@'
            },
            templateUrl: 'components/templates/card-campaign-list-item.html',
            link: function (scope, element, attrs, ctrl, transclude) {

            }
        };
}]);

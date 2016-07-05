/**
 * NgModel validator for checking if two text field matches
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';
angular.module('app.common')
  .directive('ngMatch', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        if(!ctrl) {
          return;
        }
        var match = undefined;

        attrs.$observe('ngMatch', function(val) {
          match = val;
          ctrl.$validate();
        });

        ctrl.$validators.match = function(modelValue, viewValue) {
          var value = modelValue || viewValue;
          return (!match) || (value === match);
        };
      }
    };
  });

/**
 * Image Thumb 
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .directive('imageThumb', function (mdForm) {
        return {
            restrict: 'AE',
            templateUrl: 'templates/image-thumb.html',
            link: function (scope, elem, attrs, form) {
               
            }
        }
    });

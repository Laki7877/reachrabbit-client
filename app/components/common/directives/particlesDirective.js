angular.module('app.common')
    .directive('particles', function($window) {

        return {
            restrict: 'A',
            replace: true,
            template: '<div class="particles" id="particles"></div>',
            link: function(scope, element, attrs, fn) {
              var opts = require('./particlesConfig.js');
              $window.particlesJS('particles', opts);
            }
        };
    });

/**
 * Scientific Card
 * - It's not magic. It's science.
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .directive('scientificCard', function($mdToast, $mdDialog, $api, $storage, $uibModal, $auth) {
    return {
      restrict: 'AE',
      scope: {
        model: '=ngModel'
      },
      templateUrl: function(tElement, tAttrs) {
            return "templates/scientific-card-" + tAttrs.cardType + ".html";
      },
      link: function(scope, elem, attrs, form) {

      }
    }
  });

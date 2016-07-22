/**
 * Scientific Card
 * - It's not magic. It's science.
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .directive('scientificCard', function($api, $storage, $uibModal, $auth) {
    return {
      restrict: 'AE',
      scope: {
        model: '=ngModel',
        getStatus: '=?getStatus'
      },
      templateUrl: function(tElement, tAttrs) {
            return "templates/scientific-card-" + tAttrs.cardType + ".html";
      },
      link: function(scope, elem, attrs, form) {
        if(!scope.getStatus){
          scope.getStatus = function(card){
            var status = card.virtualStatus || card.status;
            return status[0].toUpperCase() + status.substr(1);
          }
        }
      }
    }
  });

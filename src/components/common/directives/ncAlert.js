/**
 * Alert bar
 */
angular.module('app.common')
  .provider('$ncAlert', function() {
    this.defaultErrorMessage = 'Error';
    this.defaultSuccessMessage = 'Success';
    this.$get = function() {
      return this;
    };
  })
  //alert directive
  .directive('ncAlert', function($templateCache, NcAlert) {
    return {
      restrict: 'E',
      scope: {
        alert: '=ncModel'
      },
      templateUrl: 'templates/nc-alert.html',
      link: function(scope, elem) {
        //alert
        scope.$watch('alert', function(newObj) {
          if(newObj instanceof NcAlert) {
            scope.alert.element = elem;
          }
        })
      }
    }
  })
  //alert class
  .factory('NcAlert', function($document, $timeout, $ncAlert) {
    return function() {
      var vm = this;
      this.type = 'danger';
      this.show = false;
      this.close = function() {
        this.show = false;
      };
      //show bar
      this.open = function(success, msg, color) {
        color = _.isNil(color) ? 'danger' : color;
        this.type = (success) ? 'success' : color;

        if(msg) {
          this.message = msg;
        } else {
          this.message = success ? $ncAlert.defaultSuccessMessage : $ncAlert.defaultErrorMessage;
        }

        this.show = true;
      };
      //show red bar
      this.error = function(obj, toElm, scroll) {
        this.open(false, obj);

        $timeout(function() {
          var section = vm.element || $document;
          //should scroll to bar
          // if(!_.isNil(scroll)) {
          //   // if(scroll)
          //     // smoothScroll(toElm ? vm.element[0] : $document[0].body, {
          //     //   container: toElm ? '.modal': null
          //     // });

          // } else {
          //   // smoothScroll(toElm ? vm.element[0] : $document[0].body, {
          //   //   container: toElm ? '.modal': null
          //   // });
          // }
        }, 10);
      };
      //show green bar
      this.success = function(obj, toElm) {
        this.open(true, obj);

        $timeout(function() {
          var section = vm.element || $document;
          // smoothScroll(toElm ? vm.element[0] : $document[0].body, {
            // container: toElm ? '.modal': null
          // });
        }, 10);
      };
      this.message = '';
    };
  });

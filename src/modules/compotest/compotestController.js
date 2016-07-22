/**
 * Component Test controllers
 *
 * @author     Pat Sabpisal <ssabpisa@me.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.compotest')
  .controller('compotestController', function($scope) {
    $scope.messages = {
      email: {
        error: {
          required: 'This is required',
          'md-maxlength': 'Md maxlength'
        },
        hint: 'EMHINT'
      }
    };
  })
  .controller('compotestVideoPlayerController', function() {

  });


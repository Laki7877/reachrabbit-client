/**
 * Angular app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

require('./components/common');
require('./components/landing');

angular.module('app', ['app.common', 'app.landing'])
  .run(function($state) {
    $state.go('landing');
  });

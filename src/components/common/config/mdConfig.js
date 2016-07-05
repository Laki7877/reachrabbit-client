/**
 * Material Angular Configuration
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .config(function($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('lightTheme')
    .primaryPalette('light-blue') // specify primary color, all
    $mdIconProvider.fontSet("material-icons")

  });

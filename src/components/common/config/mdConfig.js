/**
 * Material Angular Configuration
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .config(function($mdThemingProvider, $mdIconProvider) {
    $mdThemingProvider.theme('default')
     .primaryPalette('teal', {
      'default': '600',
      'hue-1': '100',
      'hue-2': '900',
      'hue-3': '500'
    })
    .accentPalette('deep-orange');
    $mdIconProvider.fontSet("material-icons")

    //Dark theme
    $mdThemingProvider.theme('duck')
     .primaryPalette('blue-grey', {
      'default': '900'
    }).dark();


  });

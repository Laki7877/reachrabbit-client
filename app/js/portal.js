/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S09E01
 */
/* jshint node: true */
'use strict';

require('./common');
require('./portal.controller');
require('./portal.route');

// Declare app level module which depends on views, and components
angular.module('reachRabbitApp', [
  'angular-loading-bar',
  'ui.bootstrap',
  'ngFileUpload',
  'ngTagsInput',
  'smoothScroll',
  'ngSanitize',
  'ngPatternRestrict',
  'angularMoment',
  'luegg.directives',
  'ngImgCrop',
  'jsonFormatter',
  'chart.js',
  'reachRabbitApp.common.directives',
  'reachRabbitApp.common.routes',
  'reachRabbitApp.common.controller',
  'reachRabbitApp.portal.controller',
  'reachRabbitApp.portal.routes'
])
  //Example Campaign Constants (not mock)
  .constant('ExampleCampaigns', [
    {
      mainResource: {
        url: 'images/example-campaign/main-picture.png'
      },
      title: 'รีวิว Rabbit Lipstick 7 Days 7 Looks',
      media: [
        { mediaId: 'facebook' },
        { mediaId: 'youtube' },
        { mediaId: 'instagram' }
      ],
      budget: {
        fromBudget: 10000,
        toBudget: 50000
      },
      brand: { brandName: 'Rabbit Lipstick' },
      proposalDeadline: moment(new Date()).add(30, 'days').toDate(),
      category: { categoryName: 'ความงาม' },
      linkTo: 'brand-campaign-detail-example'
    }
  ])
  //Configure the providers
  .config(['$locationProvider', 'cfpLoadingBarProvider', function ($locationProvider, cfpLoadingBarProvider) {
    // $locationProvider.hashPrefix('');
    // $routeProvider.otherwise({redirectTo: '/404'});
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .constant('BusinessConfig', require('../business.json'))
  .run(require('./run'));

/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S09E01
 */
/* jshint node: true */
'use strict';

require('./common');
require('./brand.controller');
require('./brand.route');

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
  'ngAnimate',
  'reachRabbitApp.common.directives',
  'reachRabbitApp.common.routes',
  'reachRabbitApp.common.controller',
  'reachRabbitApp.brand.controller',
  'reachRabbitApp.brand.routes',
])
  //Example Campaign Constants (not mock)
  .constant('ExampleCampaigns', [
    {
      mainResource: {
        url: 'images/example-campaign/main-picture.png'
      },
      status: 'Open',
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
  .constant('BusinessConfig', require('../business.json'));

require('./run');
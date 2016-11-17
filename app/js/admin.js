/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S10E01
 */
/* jshint node: true */
'use strict';
require('./common');
require('./admin.controller');
require('./admin.route');

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
  'wu.masonry',
  'ngImgCrop',
  'jsonFormatter',
  'chart.js',
  'reachRabbitApp.common.directives',
  'reachRabbitApp.common.routes',
  'reachRabbitApp.common.controller',
  'reachRabbitApp.admin.controller',
  'reachRabbitApp.admin.routes',
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
  .config(['$locationProvider', 'cfpLoadingBarProvider', function ($locationProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .constant('BusinessConfig', require('../business.json'));
require('./run');
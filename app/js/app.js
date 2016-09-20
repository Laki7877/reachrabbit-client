/**
 * App
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      S04E02
 */
/* jshint node: true */
'use strict';

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
  //Top level
  'reachRabbitApp.directives',
  'reachRabbitApp.routes',
  'reachRabbitApp.controller',
  //Controllers
  'reachRabbitApp.portal.controller',
  'reachRabbitApp.brand.controller',
  'reachRabbitApp.influencer.controller',
  'reachRabbitApp.admin.controller',
  //Routes
  'reachRabbitApp.portal.routes',
  'reachRabbitApp.brand.routes',
  'reachRabbitApp.influencer.routes',
  'reachRabbitApp.admin.routes'
])
  //Mock data for testing
  .constant('MockData', {
    categories: [
      {
        categoryName: 'ความงาม'
      },
      {
        categoryName: 'ความแมว'
      },
      {
        categoryName: 'ไก่ทอด'
      },
      {
        categoryName: 'แพทฟอม'
      },
      {
        categoryName: 'พารวย'
      },
      {
        categoryName: 'Double A'
      },
      {
        categoryName: 'CP ALL'
      }
    ]
  })
  //Example Campaign Constants (not mock)
  .constant('ExampleCampaigns', [
    {
      mainResource: {
        url: 'images/example-campaign/main-picture.png'
      },
      title: 'Rabbit Lipstick 7 Days 7 Looks',
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
  .constant('BusinessConfig', {
    MIN_FOLLOWER_COUNT: 1,
    INFLUENCER_FEE: 0.18,
    INFLUENCER_BANK_TF_FEE: 30,
    DEV_ENV_HOST: ["localhost", "bella.reachrabbit.co"],
    PROTRACTOR_PORT: 9900
  })
  .run(['$rootScope', 'InfluencerAccountService', 'LongPollingService', '$location', '$window', 'NcAlert', 'UserProfile', 'BrandAccountService', 'ProposalService', 'amMoment', '$interval', 'BusinessConfig', '$sce', '$state',
    function ($rootScope, InfluencerAccountService, LongPollingService, $location, $window, NcAlert, UserProfile, BrandAccountService, ProposalService, amMoment, $interval, BusinessConfig, $sce, $state) {

      //Date override

      $rootScope.go = function (url) {
        $state.go(url);
      };

      Date.prototype.toJSON = function(){
        return moment(this).format();
      };
      Date.prototype.toISOString = function() {
        return moment(this).format();
      };

      function removeParam(key, sourceURL) {
        var rtn = sourceURL.split("?")[0],
          param,
          params_arr = [],
          queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
          params_arr = queryString.split("&");
          for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
              params_arr.splice(i, 1);
            }
          }
          rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
      }
      $rootScope.trustSrc = function (src) {
        return $sce.trustAsResourceUrl(removeParam('autoplay', src));
      };


      $rootScope.API_OVERRIDE_ACTIVE = $window.sessionStorage.API_OVERRIDE;
      $rootScope.SHOW_DEBUGGA = false;

      //check if we are in dev environment
      //TODO we will move all this to Config.json when
      //we later implement webpack
      if (BusinessConfig.DEV_ENV_HOST.indexOf($location.host()) !== -1) {
        $rootScope.SHOW_DEBUGGA = true;
      }

      //Configure angular moment
      amMoment.changeLocale('th', {
        monthsShort: 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
        longDateFormat: {
          LT: 'H:mm',
          LTS: 'H:m:s',
          L: 'YYYY/MM/DD',
          LL: 'D MMMM YYYY',
          LLL: 'D MMMM YYYY เวลา H:m',
          LLLL: 'วันddddที่ D MMMM YYYY เวลา H:m'
        },
        calendar: {
          sameDay: '[วันนี้] LT',
          nextDay: '[พรุ่งนี้] LT',
          nextWeek: 'dddd[หน้า] LT',
          lastDay: '[เมื่อวานนี้] LT',
          lastWeek: '[วัน]dddd[ที่แล้ว] LT',
          sameElse: 'L'
        },
      });

      //Take Sum of Array
      //Using value of property path PropertyString
      $rootScope.sumReduce = function (Array, PropertyString) {
        if (!Array) {
          return 0;
        }

        return Array.reduce(function (p, c) {
          return p + _.get(c, PropertyString);
        }, 0);
      };

      //Configure Raven in production mode
      // Raven.config('http://7ee88ec43e8c4a27bd097ee60bd0435d@54.169.237.222/2').install();

      $rootScope.setUnauthorizedRoute = function (textString) {
        $window.localStorage.unauthorized_route = textString;
      };

      //Configure global deafult date options for date picker
      $rootScope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false
      };

      $rootScope.formats = ['dd MMMM yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'LT - D MMM YY'];
      $rootScope.format = $rootScope.formats[0];

      //Global function helpers
      $rootScope.getProfile = UserProfile.get;
      $rootScope.signOut = function (bounce_route) {
        //clear localstorage
        var ur = $window.localStorage.unauthorized_route;
        if (!ur) {
          ur = "/";
        }
        var redirTo = ur + (bounce_route ? '?bounce_route=' + bounce_route : '');
        $window.localStorage.clear();
        //navigate to login
        $window.location.href = redirTo;
      };

      $rootScope.goTo = function (path) {
        console.error("$root.goTo is deprecated. Please stahp using it.");
      };

      $rootScope.getPath = function () {
        return $location.path();
      };

      $rootScope.rootError = new NcAlert();
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams, options) {

          //in case of brand
          if (!UserProfile.get()) {
            return;
          }

          //405 handling
          if (!$location.absUrl().endsWith('/405')) {
            var role = UserProfile.get().role;
            var reject = false;
            //Permission thingy
            if ($location.absUrl().includes('brand.html') && role !== "Brand") {
              reject = true;
            }

            if ($location.absUrl().includes('influencer.html') && role !== "Influencer") {
              reject = true;
            }

            if ($location.absUrl().includes('admin.html') && role != "Admin") {
              reject = true;
            }

            if (reject) {
              $state.go('405');
              return;
            }
          }


          //Other role specific functions
          if (UserProfile.get().role === "Brand") {
            BrandAccountService.getCart()
              .then(function (cart) {
                $rootScope.cartCount = (cart.data.proposals || []).length;
              });
          } else if (UserProfile.get().role === "Influencer") {
            $rootScope.walletBalance = 0;
            InfluencerAccountService.getWallet()
              .then(function (walletResponse) {
                var k = walletResponse.data.proposals;
                $rootScope.wallet = walletResponse.data;
                if (!k) {
                  $rootScope.walletBalance = 0;
                  return;
                }

                $rootScope.walletBalance = k.reduce(function (p, c) {
                  return (p + c.price);
                }, 0) * (1 - BusinessConfig.INFLUENCER_FEE);

              });
          }

          $rootScope.debuggah = {};
        });

      $rootScope.isExpired = function (datestr) {
        if (!datestr) {
          return false;
        }
        var d = moment(datestr, 'YYYY-MM-DD HH:mm').toDate();
        return d.getTime() <= (new Date()).getTime();
      };

      //Only init polling if User is logged in
      if (!$location.absUrl().includes("-portal") && !$location.absUrl().includes("-login") && !$location.absUrl().includes("-signup")) {
        $rootScope.pollPending = false;
        $rootScope.pollInbox = function (immediately) {
          var profile = $rootScope.getProfile();
          if (profile) {
            var imm = immediately;
            $interval(function () {
              if ($rootScope.pollPending) {
                return;
              }
              $rootScope.pollPending = true;
              LongPollingService.countInbox({
                immediate: imm
              }).then(function (res) {
                imm = false;
                if (!_.isNil(res.data)) {
                  $rootScope.inboxCount = res.data;
                }
                $rootScope.pollPending = false;
                // $rootScope.pollInbox(false);
              });
            }, 1000);
          }
        };
        $rootScope.pollInbox(true);

      }
    }]);

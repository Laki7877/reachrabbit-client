(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  require('./modules/admin')
];

angular.module('app', components)
  .run(["$state", "$json", function($state, $json) {

  }]);

},{"./modules/admin":18}],2:[function(require,module,exports){
/**
 * Setup satellizer configuration
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.common')
	.config(["$authProvider", function($authProvider) {
		$authProvider.baseUrl = "https://px-api.herokuapp.com";
		$authProvider.facebook({
			clientId: "1648733485452450",
      scope: ['pages_show_list', 'manage_pages']
		});

    //Google account - but youtube only
    $authProvider.google({
      clientId: "486841241364-75hb5e24afp7msiitf8t36skfo3mr0h7.apps.googleusercontent.com",
      scope: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/userinfo.email']
    });

    //Instagram
    $authProvider.instagram({
      clientId: "c428876109c44daa9a54cf568e96e483",
      scope: ['likes', 'public_content', 'basic']
    });


	}]);

},{}],3:[function(require,module,exports){
/**
 * Setup loading bar
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])

},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
/**
 * Set of form fields with functionalities
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    /*
    * Checkbox list of interested topics
    */
    .directive('fsInterestsSelector', ["$uploader", "$api", function ($uploader, $api) {
        return {
            restrict: 'AE',
            scope: {
              model: '=ngModel' //selected object
            },
            templateUrl: 'templates/fs-interests-selector.html',
            link: function (scope, elem, attrs, form) {

                scope.topics = [];
                //get cat list
                $api({
                  method: 'GET',
                  url: '/data/categories'
                }).then(function(data) {
                  scope.topics = data;
                }).catch(function(err) {
                  console.error("fsInterestsSelector", err);
                });

                scope.topicExists = function(item) {
                  return scope.model.indexOf(item.categoryId) !== -1;
                }
                scope.topicDisabled = function(item) {
                  return scope.model.length >= 3 && !scope.topicExists(item, scope.model)
                }
                scope.topicToggle = function(item) {
                  if (scope.topicDisabled(item, scope.model)) return;
                  if (scope.topicExists(item, scope.model)) {
                    _.remove(scope.model, function(x) {
                      return x == item.categoryId
                    })
                  } else {
                    scope.model.push(item.categoryId)
                  }
                }

            }
        }
    }])
    /*
    * Bank selector
    */
    .directive('fsBankSelector', ["$api", function ($api) {
      return {
        restrict: 'AE',
        scope: {
          model: '=ngModel'
        },
        templateUrl: 'templates/fs-bank-selector.html',
        link: function(scope, elem, attrs, form){
                scope.banks = [];

                $api({
                  method: 'GET',
                  url: '/data/banks'
                }).then(function(data) {
                  scope.banks = data;
                }).catch(function(err) {
                  console.error("fsBankInfoSelector", err);
                });

        }
      }
    }])
    .directive('fsMediaSelector', ["$api", function ($api) {
      return {
        restrict: 'AE',
        scope: {
          model: '=ngModel'
        },
        templateUrl: 'templates/fs-media-selector.html',
        link: function(scope, elem, attrs, form){
                scope.medium = [];

                $api({
                  method: 'GET',
                  url: '/data/medium'
                }).then(function(data) {
                  scope.medium = data;
                }).catch(function(err) {
                  console.error("fsMediaSelector", err);
                });

        }
      }
    }])
    .directive('fsCampaignCategorySelector', ["$api", function ($api) {
      return {
        restrict: 'AE',
        scope: {
          model: '=ngModel'
        },
        templateUrl: 'templates/fs-campaign-category-selector.html',
        link: function(scope, elem, attrs, form){
                scope.categories = [];

                $api({
                  method: 'GET',
                  url: '/data/categories'
                }).then(function(data) {
                  scope.categories = data;
                }).catch(function(err) {
                  console.error("fsCampaignCategorySelector", err);
                });

        }
      }
    }]);

},{}],6:[function(require,module,exports){
/**
 * Image Thumbnail with uploader
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .directive('imageThumb', ["$uploader", function ($uploader) {
        return {
            restrict: 'AE',
            scope: {
              width: '=',
              height: '=',
              noImageUrl: '@?',
              model: '=ngModel',
              accessor: '&?'  //function that defines how to access the url of the model
            },
            templateUrl: 'templates/image-thumb.html',
            link: function (scope, elem, attrs, form) {
              var noImage = scope.noImageUrl || 'http://orig03.deviantart.net/561f/f/2014/315/9/c/'+
              'rabbit_doubt_mask_avatar_for_facebook_by_facebookavatars-d8622bz.png';

              if(!scope.accessor){
                scope.accessor = function(data){
                  if(!scope.model) return noImage;
                  return data.url;
                }
              }

              scope.loadingImage = false;
              scope.upload = function(file) {
                scope.loadingImage = true;
                $uploader.upload('/file', file)
                .then(function(data) {
                  scope.loadingImage = false;
                  scope.model = data;
                });
              };


            }
        }
    }]);

},{}],7:[function(require,module,exports){
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
  .directive('ncAlert', ["$templateCache", "NcAlert", function($templateCache, NcAlert) {
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
  }])
  //alert class
  .factory('NcAlert', ["$document", "$timeout", "$ncAlert", function($document, $timeout, $ncAlert) {
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
  }]);

},{}],8:[function(require,module,exports){
/**
 * NgModel validator for checking if two text field matches
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';
angular.module('app.common')
  .directive('ngMatch', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        if(!ctrl) {
          return;
        }
        var match = undefined;

        attrs.$observe('ngMatch', function(val) {
          match = val;
          ctrl.$validate();
        });

        ctrl.$validators.match = function(modelValue, viewValue) {
          var value = modelValue || viewValue;
          return (!match) || (value === match);
        };
      }
    };
  });

},{}],9:[function(require,module,exports){
/**
 * Scientific Card
 * - It's not magic. It's science.
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .directive('scientificCard', ["$api", "$storage", "$uibModal", "$auth", function($api, $storage, $uibModal, $auth) {
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
  }]);

},{}],10:[function(require,module,exports){
/**
 * Social Linker Pills
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.common')
  .directive('socialLinker', ["$api", "$storage", "$uibModal", "$auth", function($api, $storage, $uibModal, $auth) {
    return {
      restrict: 'AE',
      scope: {
        model: '=ngModel', //dictionary model where key is social , ex {'instagram' : <profileObject> }
        accessor: '&?', //function that defines how to access the url of the model,
        onSuccess: '=?', //resolves with { user: UserObject, page: PageObject }
        onFail: '=?',
        onAlreadyLoggedIn: '=?'
      },
      templateUrl: 'templates/social-linker.html',
      link: function(scope, elem, attrs, form) {
        scope.linkedWith = function(key) {
          return key in scope.model;
        }
        scope.medium = []

        //get medium list
        $api({
          method: 'GET',
          url: '/data/medium'
        }).then(function(data) {
          scope.medium = data;
          console.log(scope.medium)
        }).catch(function(err) {
          console.error("Medium list fetch failure", err);
        });

        function showFbPageChooser(fbUser) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/social-linker-fb-pages.html',
            controller: ["$scope", "fbUser", "$uibModalInstance", function($scope, fbUser, $uibModalInstance) {
              console.log('fbUser', fbUser);
              $scope.pages = fbUser.accounts;
              //on user select page
              $scope.choose = function(page) {
                //end of facebook flow
                console.log("User did select page", page);

                $uibModalInstance.close();

                //assign model
                scope.model['facebook'] = {
                  socialId: fbUser.id,
                  token: fbUser.token,
                  mediaId: 'facebook',
                  pageId: page.id
                };

                alert('Linked to Facebook account');

                if (scope.onSuccess) {
                  scope.onSuccess({
                    user: fbUser,
                    page: page,
                    provider: 'facebook',
                    modelBind: scope.model['facebook']
                  });
                }

              }
            }],
            backdrop:'static',
            size: 'md',
            resolve: {
              fbUser: function() {
                return fbUser;
              }
            }
          });

        };

        scope.linkWith = function(key) {
            $auth.authenticate(key)
              .then(function(res) {

                console.log('linkWith resolve', res);
                if(res.data.isLogin) {
                  $storage.putAuth(res.data.token);
                  if(scope.onAlreadyLoggedIn){
                    scope.onAlreadyLoggedIn(res.data);
                  }
                }

                if (key == 'facebook') {
                  //Facebook special case
                  //Flow not over yet
                  showFbPageChooser(res.data);
                } else {
                  alert('Linked to ' + key + ' account');

                  //Other case, flow is over
                  //set social profile model
                  scope.model[key] = {
                    socialId: res.data.id,
                    token: res.data.token,
                    mediaId: key,
                    pageId: null
                  };

                  if (scope.onSuccess) {
                    scope.onSuccess({
                      user: res.data,
                      page: null,
                      provider: key,
                      modelBind: scope.model[key]
                    });
                  }
                }



              })
              .catch(function(err) {
                if (!err) return;

                //TODO replace with generic error handler
                if (err.data && err.data.display) {
                  alert(err.data.display.title);
                }
                console.warn(err);
                if (scope.onFail) scope.onFail(err);
              });
          } //linkWith



      }
    }
  }]);

},{}],11:[function(require,module,exports){
/**
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .filter('capitalize', function() {
      return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
      }
    });

},{}],12:[function(require,module,exports){
/**
 * API service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
 */
'use strict';

angular.module('app.common')
  .factory('$api', ["$http", "$storage", "$q", "$state", function($http, $storage, $q, $state) {
    var service = function(opts) {
      var defer = $q.defer();
      var token = $storage.getAuth();
      if(!opts.headers) {
        opts.headers = {};
      }
      if(token) {
        opts.headers.Authorization = 'JWT ' + token;
      }
      if(opts.url.indexOf('http') !== 0) {
        opts.url = "https://px-api.herokuapp.com" + opts.url;
      }
      opts.skipAuthorization = true;

      // endpoint
      $http(opts).then(function(result) {
        defer.resolve(result.data);
      }).catch(function(err) {
        console.log("Error", err);
        if(err.status == 401){
          $state.go('error', {code: 401, description: err });
        }
        defer.reject(err);
      });

      return defer.promise;
    };

    return service;
  }])
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

},{}],13:[function(require,module,exports){
/**
 * JSON service (overrides default JSON serializer)
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .factory('$json', ["$http", "$storage", "$q", function ($http, $storage, $q) {
        //Credit to @RickStrahl
            var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
            var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

            /// <summary>
            /// set this if you want MS Ajax Dates parsed
            /// before calling any of the other functions
            /// </summary>
            JSON.parseMsAjaxDate = false;
  
            JSON.useDateParser = function (reset) {
                /// <summary>
                /// Globally enables JSON date parsing for JSON.parse().
                /// replaces the default JSON parser with parse plus dateParser extension 
                /// </summary>    
                /// <param name="reset" type="bool">when set restores the original JSON.parse() function</param>

                // if any parameter is passed reset
                if (typeof reset != "undefined") {
                    if (JSON._parseSaved) {
                        JSON.parse = JSON._parseSaved;
                        JSON._parseSaved = null;
                    }
                } else {
                    if (!JSON.parseSaved) {
                        JSON._parseSaved = JSON.parse;
                        JSON.parse = JSON.parseWithDate;
                    }
                }
            };

            JSON.dateParser = function (key, value) {
                /// <summary>
                /// Globally enables JSON date parsing for JSON.parse().
                /// Replaces the default JSON.parse() method and adds
                /// the datePaser() extension to the processing chain.
                /// </summary>    
                /// <param name="key" type="string">property name that is parsed</param>
                /// <param name="value" type="any">property value</param>
                /// <returns type="date">returns date or the original value if not a date string</returns>
                if (typeof value === 'string') {
                    var a = reISO.exec(value);
                    if (a)
                        return new Date(value);

                    if (!JSON.parseMsAjaxDate)
                        return value;

                    a = reMsAjax.exec(value);
                    if (a) {
                        var b = a[1].split(/[-+,.]/);
                        return new Date(b[0] ? +b[0] : 0 - +b[1]);
                    }
                }
                return value;
            };

            JSON.parseWithDate = function (json) {
                /// <summary>
                /// Wrapper around the JSON.parse() function that adds a date
                /// filtering extension. Returns all dates as real JavaScript dates.
                /// </summary>    
                /// <param name="json" type="string">JSON to be parsed</param>
                /// <returns type="any">parsed value or object</returns>
                var parse = JSON._parseSaved ? JSON._parseSaved : JSON.parse;
                try {
                    var res = parse(json, JSON.dateParser);
                    return res;
                } catch (e) {
                    // orignal error thrown has no error message so rethrow with message
                    throw new Error("JSON content could not be parsed");
                }
            };

            JSON.dateStringToDate = function (dtString, nullDateVal) {
                /// <summary>
                /// Converts a JSON ISO or MSAJAX date or real date a date value.
                /// Supports both JSON encoded dates or plain date formatted strings
                /// (without the JSON string quotes).
                /// If you pass a date the date is returned as is. If you pass null
                /// null or the nullDateVal is returned.
                /// </summary>    
                /// <param name="dtString" type="var">Date String in ISO or MSAJAX format</param>
                /// <param name="nullDateVal" type="var">value to return if date can't be parsed</param>
                /// <returns type="date">date or the nullDateVal (null by default)</returns> 
                if (!nullDateVal)
                    nullDateVal = null;

                if (!dtString)
                    return nullDateVal; // empty

                if (dtString.getTime)
                    return dtString; // already a date

                if (dtString[0] === '"' || dtString[0] === "'")
                    // strip off JSON quotes
                    dtString = dtString.substr(1, dtString.length - 2);

                var a = reISO.exec(dtString);
                if (a)
                    return new Date(dtString);

                if (!JSON.parseMsAjaxDate)
                    return nullDateVal;

                a = reMsAjax.exec(dtString);
                if (a) {
                    var b = a[1].split(/[-,.]/);
                    return new Date(+b[0]);
                }
                return nullDateVal;
            };
        JSON.useDateParser();
        console.log("Init $json")
        return JSON.parse;
    }]);

},{}],14:[function(require,module,exports){
/**
 * Local storage service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$storage', ["$window", function($window) {
    var service = {};
    var uniqueKey = 'projectx.';

    return {
      has: function(key) {
        return !_.isNil(this.get(key));
      },
      get: function(key) {
        var obj = $window.localStorage.getItem(uniqueKey + key);
        if(_.isString(obj)) {
          try {
            return CJSON.parse(obj);
          }
          catch(e) {
            return obj;
          }
        }
        return obj;
      },
      put: function(key, object) {
        var obj = _.isPlainObject(object) ? CJSON.stringify(object) : object;
        $window.localStorage.setItem(uniqueKey + key, obj);
      },
      remove: function(key) {
        $window.localStorage.removeItem(uniqueKey + key);
      },
      putAuth: function(token) {
        this.put('auth', token);
      },
      getAuth: function() {
        return this.get('auth');
      },
      removeAuth: function() {
        this.remove('auth');
      }
    };
  }]);

},{}],15:[function(require,module,exports){
/**
 * File uploader service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$uploader', ["Upload", "$q", function(Upload, $q) {
    var service = {};

    service.upload = function(url, file, data, opts) {
      var deferred = $q.defer();
      var options = _.extend({
        url: "https://px-api.herokuapp.com" + url,
        data: _.extend({}, data, { file: file }),
        skipAuthorization: true
      }, opts);

      // upload on url
      Upload.upload(options).then(function(data) {
        deferred.resolve(data.data);
      }, deferred.reject);

      return deferred.promise;
    };

    return service;
  }]);

},{}],16:[function(require,module,exports){

/**
 * Virtual status
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    .factory('VirtualStatus', ["$http", "$storage", "$q", function ($http, $storage, $q) {
        return {
          isApplied: function(campaignObject){
            var profile = $storage.get('profile');
            console.log('prof', profile);
            var isApplied = _.find(campaignObject.campaignProposals, function(x){
              return x.influencerId === profile.influencer.influencerId
            });
            return (campaignObject.status == 'open' ||
              campaignObject.status == 'payment pending' ||
              campaignObject.status == 'wait for confirm' ||
              campaignObject.status == 'wait for payment') && isApplied;
          }
        }
    }]);

},{}],17:[function(require,module,exports){
/**
 * common components
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  'ngSanitize',
	'ui.router',
	'angularCSS',
	'satellizer',
  'ngFileUpload',
  'ui.bootstrap',
  'angular-loading-bar'
];

angular.module('app.common', components)
.controller('errorController', ["$scope", "$state", function($scope, $state){
  console.log($state.params);
  $scope.code = $state.params.code;
  $scope.description = $state.params.description;
}])
.run(["$json", "$rootScope", "$storage", function($json, $rootScope, $storage) {

      $rootScope.getProfile = function(){
        return $storage.get('profile');
      }

      $rootScope.getRouteByStatus = function(card){
        if(card.status == 'payment pending' ||
          card.status == 'wait for payment' ||
          card.status == 'wait for confirm'){
          return 'open';
        }
        return (card.status || '').toLowerCase();
      }

      $rootScope.getRouteByStatusApplied = function(card){
        if(card.status == 'payment pending' ||
          card.status == 'wait for payment' || card.status == 'open' ||
          card.status == 'wait for confirm'){
          return 'applied';
        }
        return (card.status || '').toLowerCase();
      }

      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
       console.error('Router change error', event, toState, toParams, fromState, error);
      });

      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, error) {
       console.log('Router change success', event, toState, toParams, fromState, error);
      });


  }]);



(function () {var f = require("./index.js");f["config"]=({"authConfig":require("./config/authConfig.js"),"loadingConfig":require("./config/loadingConfig.js")});f["directives"]=({"formField":require("./directives/formField.js"),"formSet":require("./directives/formSet.js"),"imageThumb":require("./directives/imageThumb.js"),"ncAlert":require("./directives/ncAlert.js"),"ngMatch":require("./directives/ngMatch.js"),"scientificCard":require("./directives/scientificCard.js"),"socialLinker":require("./directives/socialLinker.js")});f["filters"]=({"capitalize":require("./filters/capitalize.js")});f["helpers"]=({"api":require("./helpers/api.js"),"json":require("./helpers/json.js"),"storage":require("./helpers/storage.js"),"uploader":require("./helpers/uploader.js"),"virtualStatus":require("./helpers/virtualStatus.js")});f["index"]=require("./index.js");return f;})();

module.exports = 'app.common';

},{"./config/authConfig.js":2,"./config/loadingConfig.js":3,"./directives/formField.js":4,"./directives/formSet.js":5,"./directives/imageThumb.js":6,"./directives/ncAlert.js":7,"./directives/ngMatch.js":8,"./directives/scientificCard.js":9,"./directives/socialLinker.js":10,"./filters/capitalize.js":11,"./helpers/api.js":12,"./helpers/json.js":13,"./helpers/storage.js":14,"./helpers/uploader.js":15,"./helpers/virtualStatus.js":16,"./index.js":17}],18:[function(require,module,exports){
/**
 * Admin module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
 */
'use strict';

var components = [
  require('../../components/common')
];

app.module('app.admin', components)
  .config(function($stateProvider) {
    /**
     * Main Layout
     */
    $stateProvider
      .state('main', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'abstract/main-brand.html'
          }
        }
      });
  });

},{"../../components/common":17}]},{},[1])


angular.module("app.common").run(["$templateCache", function($templateCache) {
$templateCache.put("views/common-error.html", "<div class=\"container-fluid text-center\" style=\"height: 300px; background-image:url(/static/404.png);background-repeat:no-repeat; background-position-x: 63%\"></div><div class=\"container text-center\"><h1>Error {{ code }}</h1><p>The rabbits are fucking with us...</p><p ng-if=\"code == 401\"><strong>Our guess is that you are not logged in.</strong></p><a class=\"btn btn-primary\" href=\"/\">กลับบ้านเกิด</a></div><br><div class=container><div class=row><div class=\"col-md-6 col-md-offset-3\"><hr><code>\n{{ description | json }}\n</code><p></p></div></div></div>");
$templateCache.put("templates/social-linker.html", "<div class=controls><label class=control-label>Connect with</label><br><button ng-repeat=\"media in medium\" style=margin-right:5px ng-disabled=linkedWith(media.mediaId) ng-click=linkWith(media.mediaId) class=\"btn btn-primary btn-sm btn-primary\"><i class=\"fa fa-{{ media.mediaId }}\" aria-hidden=true></i> {{ media.mediaName }}</button></div>");
$templateCache.put("templates/social-linker-fb-pages.html", "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>Choose Facebook Page you want to associate</h3></div><div class=panel-body ng-if=\"pages.length == 0\">You have no page to associate.</div><div class=panel-body ng-if=\"pages.length > 0\"><div class=media ng-repeat=\"item in pages\" ng-click=choose(item)><div class=media-left><img width=100 ng-src={{item.picture.url}} class=media-object alt=\"Profile Picture\"></div><div class=media-body><h4 class=media-heading>{{item.name}}</h4><p>{{item.fan_count}} dudes liked this page.</p></div></div></div></div>");
$templateCache.put("templates/scientific-card-user-influencer.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=media><div class=media-left><img class=media-object src=\"{{ card.profilePicture.url }}\"></div><div class=media-body><h4 class=media-heading>{{ card.name }}</h4><p>{{card.about}}</p><br><span>Facebook Follower: <strong>1,250</strong> | Instagram Follower: <strong>15,250</strong> | YouTube Follower: <strong>15,250</strong></span><br>Interest: <strong>Beauty, Food, Travel</strong></div></div></div>");
$templateCache.put("templates/scientific-card-influencer.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=media><div class=media-left><img class=media-object src=\"{{ card.user.profilePicture.url }}\"></div><div class=media-body><h4 class=media-heading>{{ card.user.name }}</h4><p>{{card.about}}</p><br><span>Facebook Follower: <strong>1,250</strong> | Instagram Follower: <strong>15,250</strong> | YouTube Follower: <strong>15,250</strong></span><br>Interest: <strong>Beauty, Food, Travel</strong></div></div></div>");
$templateCache.put("templates/scientific-card-influencer-proposal.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=panel-body><h3>Proposal Detail</h3>{{card.description}}<br><h3>Proposed Price: {{card.proposePrice}} <small>Baht</small></h3><strong>Status:</strong> {{card.status}}<div ng-repeat=\"resource in card.resources\"><h3>Image Attachment</h3><img src={{resource.url}} width=500></div></div></div>");
$templateCache.put("templates/scientific-card-influencer-campaign.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"{{card.status}}-campaign.detail({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>Campaign Status: {{ getStatus(card) }}</span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget }}</h4></div><div class=media-item><h5>Submission Deadline</h5><h4>{{ card.submissionDeadline | date }}</h4></div><div class=media-item ng-show=card.category><h5>Category</h5><h4>{{ card.category }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Soon</h4></div></div></div></div>");
$templateCache.put("templates/scientific-card-influencer-campaign-detail.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"open-campaign.detail({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i></h4></a><div class=media-item><h5>Status</h5><h4>{{ getStatus(card) }}</h4></div><div class=media-item><h5>Reward</h5><h4>{{ card.budget }}</h4></div><div class=media-item><h5>Category</h5><h4>{{ card.category.categoryName }}</h4></div><div class=media-item><h5>Proposal Deadline</h5><h4>{{ card.proposalDeadline | date : \"d/M/y H:m:s\" }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Not Supported</h4></div></div></div></div>");
$templateCache.put("templates/scientific-card-brand-proposal.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=media><div class=media-left><img class=media-object src=\"{{ card.profilePicture.url }}\"></div><div class=media-body><a ui-sref=\"campaign-detail-open.detail.proposal({ user: card })\"><h4 class=media-heading>{{ card.name }} <span class=pull-right>Status: {{ card.influencer.campaignProposals[0].status }}</span></h4></a><div class=media-item><h5>Instagram Followers:</h5><h4>0</h4></div><div class=media-item><h5>Submitted on:</h5><h4>{{ card.influencer.campaignProposals[0].updatedAt | date: \'d/M/y HH:mm\' }}</h4></div><br><br><div class=media-item><h5>Quotation:</h5><h4>{{ card.influencer.campaignProposals[0].proposePrice | number: 2 }}</h4></div><div class=media-item><h5>Cost per Follower:</h5><h4>Less than 0.00 Baht</h4></div></div></div></div>");
$templateCache.put("templates/scientific-card-brand-my-campaign.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object ng-src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"campaign-detail-{{ getStatus(card).toLowerCase()}}.detail({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>Campaign Status: {{ getStatus(card) }}</span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget }}</h4></div><div class=media-item><h5>Deadline</h5><h4 ng-if=\"card.status != \'production\'\">{{ card.proposalDeadline | date: \'d/M/y\' }}</h4><h4 ng-if=\"card.status == \'production\'\">{{ card.submissionDeadline | date: \'d/M/y\' }}</h4></div><div class=media-item><h5>Wait for Review</h5><h4>-</h4></div><div class=media-item><h5>Selected</h5><h4>-</h4></div><div class=media-item ng-if=card.category><h5>Category</h5><h4>{{ card.category.categoryName }}</h4></div></div></div></div>");
$templateCache.put("templates/scientific-card-brand-comment.html", "<div class=\"panel panel-default\" ng-repeat=\"card in model\"><div class=panel-body><h3>Brand Comment</h3><blockquote>{{card}}</blockquote></div></div>");
$templateCache.put("templates/ncAlertTemplate.html", "<div class=alert ng-class=\"[\'alert-\' + (type || \'danger\')]\" role=alert><span class=\"close color opacity-1\" ng-class=\"\'alert-\' + (type || \'danger\')\" aria-hidden=true ng-show=closeable ng-click=\"close({$event: $event})\">&times;</span><ng-transclude><ng-transclude></ng-transclude></ng-transclude></div>");
$templateCache.put("templates/nc-alert.html", "<div ng-show=alert.show uib-alert template-url=templates/ncAlertTemplate.html type=\"{{ alert.type }}\" close=alert.close()><span ng-bind-html=alert.message></span></div>");
$templateCache.put("templates/image-thumb.html", "<div class=\"fileinput fileinput-new\" data-provides=fileinput><div class=fileinput-new style=\"width: {{width}}px; height:{{height}}px; text-align:center\"><img ng-show=!loadingImage src=\"{{ accessor(model) }}\" height={{height}} width={{width}}><div layout=row layout-sm=column ng-show=loadingImage layout-align=space-around style=\"padding-top: 100px;\">Please Wait..</div></div><br><div class=\"fileinput-preview fileinput-exists thumbnail\" style=\"max-width: 200px; max-height: 150px;\"></div><label class=\"btn btn-default btn-md btn-file\"><span class=fileinput-new><i class=\"fa fa-folder-open\"></i> Choose Image..</span> <span class=fileinput-exists>Change</span> <input type=file name=slip data-ngf-select=upload($file)> <a href=# class=\"btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></label></div>");
$templateCache.put("templates/fs-media-selector.html", "<div class=control-group><label class=control-label for=media>Media</label><select class=form-control ng-model=model ng-options=\"media as media.mediaName for media in medium track by media.mediaId\" id=media></select></div>");
$templateCache.put("templates/fs-interests-selector.html", "<div class=control-group><label class=control-label for=aboutyourself>Your Interest (Can select up to 3)</label><p>You will be notified according to the interest that you selected.</p><div class=controls><div class=checkbox ng-repeat=\"topic in topics\"><label><input type=checkbox ng-change=topicToggle(topic) ng-model=dummy ng-disabled=topicDisabled(topic)>{{ topic.categoryName }}</label></div></div></div>");
$templateCache.put("templates/fs-campaign-category-selector.html", "<div class=control-group><label class=control-label for=camcat>Campaign Category</label><select class=form-control ng-model=model ng-options=\"category as category.categoryName for category in categories track by category.categoryId\" id=camcat></select></div>");
$templateCache.put("templates/fs-bank-selector.html", "<div class=control-group><label class=control-label for=bankname>Bank Name</label><select class=form-control ng-model=model ng-options=\"bank as bank.bankName for bank in banks track by bank.bankId\" id=bankname></select></div>");
}]);
//# sourceMappingURL=adminApp.js.map

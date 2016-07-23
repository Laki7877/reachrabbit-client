(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/brand')
];

angular.module('app', components)
  .run(["$state", "$rootScope", "$storage", function($state, $rootScope, $storage) {

   
  }]);

},{"./modules/brand":21}],2:[function(require,module,exports){
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
 * API service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$api', ["$http", "$storage", "$q", function($http, $storage, $q) {
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
          alert("Not logged in");
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){

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

},{}],16:[function(require,module,exports){
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



(function () {var f = require("./index.js");f["config"]=({"authConfig":require("./config/authConfig.js"),"loadingConfig":require("./config/loadingConfig.js")});f["directives"]=({"formField":require("./directives/formField.js"),"formSet":require("./directives/formSet.js"),"imageThumb":require("./directives/imageThumb.js"),"ncAlert":require("./directives/ncAlert.js"),"ngMatch":require("./directives/ngMatch.js"),"scientificCard":require("./directives/scientificCard.js"),"socialLinker":require("./directives/socialLinker.js")});f["helpers"]=({"api":require("./helpers/api.js"),"json":require("./helpers/json.js"),"storage":require("./helpers/storage.js"),"uploader":require("./helpers/uploader.js"),"virtualStatus":require("./helpers/virtualStatus.js")});f["index"]=require("./index.js");return f;})();

module.exports = 'app.common';

},{"./config/authConfig.js":2,"./config/loadingConfig.js":3,"./directives/formField.js":4,"./directives/formSet.js":5,"./directives/imageThumb.js":6,"./directives/ncAlert.js":7,"./directives/ngMatch.js":8,"./directives/scientificCard.js":9,"./directives/socialLinker.js":10,"./helpers/api.js":11,"./helpers/json.js":12,"./helpers/storage.js":13,"./helpers/uploader.js":14,"./helpers/virtualStatus.js":15,"./index.js":16}],17:[function(require,module,exports){
/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';
angular.module('app.brand')
  .controller('brandAccountProfileController', ["$scope", "$state", "$api", "$uploader", "$storage", function ($scope, $state, $api, $uploader, $storage) {
    //Hacky, will change after TODO: Friday
    document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    document.getElementsByTagName("body")[0].style.backgroundColor = "#ebebeb";
    $scope.formData = {
      socialAccounts: {}, selectedTopics: []
    };

    $scope.upload = function (file) {
      $scope.loadingImage = true;
      $uploader.upload('/file', file)
        .then(function (data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data;
        });
    };

    //get user info
    $api({
      method: 'GET',
      url: '/profiles'
    }).then(function (data) {
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function (err) {
      console.log(err);
    });

  }])
  .controller('brandAccountSigninController', ["$scope", "$state", "$storage", "$api", function ($scope, $state, $storage, $api) {
    // on form submit
    $scope.submit = function (form) {
      // call api
      $api({
        method: 'POST',
        url: '/login',
        data: $scope.formData
      }).then(function (data) {
        $storage.put('auth', data.token);
        //Get user info
        return $api({
          method: 'GET',
          url: '/profiles'
        });
      })
      .then(function(data) {
          $storage.put('profile', data);
          $state.go('campaign-list');
      })
      .catch(function (err) {
        console.error(err);
      });
    };
  }]);

},{}],18:[function(require,module,exports){
/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.2
 */
'use strict';

angular.module('app.brand')
  .controller('brandTransactionListController', ["$scope", "$state", "$stateParams", "$api", function($scope, $state, $stateParams,  $api){
      console.log("Transaction loaded");
      $scope.transactions = [];
      $api({
        url: "/transactions",
        "method": "GET"
      }).then(function(data){
        $scope.transactions = data.rows;
      })
  }])
	.controller('brandCampaignPaymentController', ["$scope", "$state", "$stateParams", "$api", "campaign", function($scope, $state, $stateParams,  $api, campaign){
		$scope.campaign = campaign;
    $scope.paymentObject = {};
		$scope.campaign.selectedProposals = _.compact($scope.campaign.campaignProposals.map(function(o){ if(o.isSelected) return o; }));
    $scope.sumFee = $scope.campaign.selectedProposals.reduce(function(total, num){
      return total + Number(num.proposePrice);
    },0);

    $scope.allProposals = $stateParams.allProposals || 0;
    $scope.countSelected = $stateParams.selected || 0;
    $scope.countBudget = $stateParams.budget || 0;
    $scope.countReach = $stateParams.reach || 0;

		$scope.goBack = function() {
			$state.go('^');
		}

    $scope.readyToPay = function(){
      console.log('readyToPay')
      $api({
        method: "POST",
        url: "/campaigns/" + $stateParams.campaignId + '/transactions'
      }).then(function(success){
        $state.go("campaign-list", { alert: "Campaign now waiting for payment. "})
      }).catch(function(err){
        console.error(err);
      })
    }

    $scope.sendSlip = function(p){
      $api({
        method: "PUT",
        url: "/campaigns/" + $stateParams.campaignId + '/transactions',
        data: p
      }).then(function(success){
        $state.go("^", {
          campaignId: $stateParams.campaignId,
          alert: "Thank you for the slip. Your campaign status will be updated when our system administrator approves your transaction."})
      })
    }

	}])
	.controller('brandCampaignProposalDetailController', ["$scope", "NcAlert", "$state", "$api", "$window", "$uibModal", "$stateParams", function ($scope, NcAlert, $state, $api, $window, $uibModal, $stateParams) {
		$scope.goBack = function () {
			//go back
			$state.go('^');
		}

    $scope.alert = new NcAlert();

		if (!$stateParams.user) {
			return alert("You're not supposed to be here bitch.");
		}
    console.log($stateParams.user)

		$scope.proposal = $stateParams.user.influencer.campaignProposals[0];
		$scope.influencers = [$stateParams.user];

		$scope.askForRevision = function (proposal) {
			var tmpl = 'partials/modal-revision-proposal.html';
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: tmpl,
				controller: ["$scope", "$api", "$uibModalInstance", "proposal", function ($scope, $api, $uibModalInstance, proposal) {
					$scope.formData = proposal;
          $scope.formData.status = "need revision";
					$scope.saveComment = function () {
						console.log("Saving")
						$api({
							url: '/campaigns/' + proposal.campaignId + '/proposals/' + proposal.proposalId,
							method: 'PUT',
							data: $scope.formData
						}).then(function (data) {
							$uibModalInstance.close(data);
						}).catch(function (err) {
							alert("Can't save! Nien.")
						});
					}
				}],
				size: 'lg',
				resolve: {
					'proposal': function () {
						return proposal;
					}
				}
			});

			modalInstance.result.then(function (data) {
				console.log(data);
        $state.go("campaign-list.open", { alert: 'Revision requested'});
        $api({
          method: 'PUT',
          url: '/campaigns/' + $stateParams.campaignId + '/proposals/' + proposal.proposalId,
          data: _.extend({}, proposal, {status: 'need revision'})
        })
        .then(function(data) {
          $scope.proposal = data;
        });
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});


		}

		$scope.selectProposal = function (proposal) {
			$api({
				method: 'PUT',
				url: '/campaigns/' + $stateParams.campaignId + '/proposals/' + proposal.proposalId,
				data: _.extend({}, proposal, {isSelected: true})
			})
			.then(function(data) {
				$scope.proposal = data;
			});
		}

		$scope.unselectProposal = function (proposal) {
			$api({
				method: 'PUT',
				url: '/campaigns/' + $stateParams.campaignId + '/proposals/' + proposal.proposalId,
				data: _.extend({}, proposal, {isSelected: false})
			})
			.then(function(data) {
				$scope.proposal = data;
			});
		}

	}])
	.controller('brandCampaignDetailOpenController', ["$scope", "NcAlert", "$api", "$state", "$stateParams", function ($scope, NcAlert, $api, $state, $stateParams) {
		$scope.formData = {};
    $scope.alert = new NcAlert();
		$scope.formDataArray = [];
		$scope.proposals = [];
		if (!$stateParams.campaignId) {
			$scope.alert.error("No campaign ID provided");
		}

    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $scope.sumBudgetSelected = function(x){
      return x.reduce(function(prev, cur){
        return prev + Number(cur.influencer.campaignProposals[0].proposePrice);
      }, 0);
    }

    $scope.countSelected = function(x){
      return x.reduce(function(prev, cur){
        return prev + Number(cur.influencer.campaignProposals[0].isSelected ? 1 : 0);
      }, 0);
    }

		$scope.reviewAndPay = function(){
			$state.go('campaign-list.open.pay', { campaign: $scope.formData });
		}

		$api({
			method: 'GET',
			url: '/campaigns/' + $stateParams.campaignId
		}).then(function (data) {
			$scope.formData = data;
			$scope.formDataArray = [$scope.formData];
		}).catch(function (err) {
			console.error("cant get campaign data", err);
		});

		$api({
			method: 'GET',
			url: '/campaigns/' + $stateParams.campaignId + '/proposals'
		}).then(function (data) {
			$scope.proposals = data.rows;
		}).catch(function (err) {
			console.error("can't get proposals", err);
		});

	}])
	.controller('brandCampaignDetailDraftController', ["$scope", "$state", "$api", "$stateParams", function ($scope, $state, $api, $stateParams) {
		var method = 'POST';
		var url = '/campaigns';

		$scope.formData = {
			status: 'draft',
			resources: [],
			media: []
		};

		if ($stateParams.campaignId) {
			$api({
				method: 'GET',
				url: '/campaigns/' + $stateParams.campaignId
			}).then(function (data) {
				$scope.formData = data;
				method = 'PUT';
				url = url + '/' + $stateParams.campaignId;
			}).catch(function (err) {
				console.error("bad stuff happened", err);
			});
		}

		function save() {
			$api({
				method: method,
				url: url,
				data: $scope.formData
			}).then(function (data) {
				$state.go('campaign-list', { alert : "Campaign saved successfully. "});
			}).catch(function (err) {
				console.error("bad stuff happened", err);
			});
		}

		$scope.saveDraft = function () {
			console.log("Saving as Draft")
			save();
		}

		$scope.savePublish = function () {
			$scope.formData.status = 'open';

			console.log("Saving as Publish")
			save();
		}

	}])
	.controller('brandCampaignListController', ["$scope", "$api", "$stateParams", "NcAlert", function ($scope, $api, $stateParams, NcAlert) {
		$scope.campaigns = [];
		$api({
			method: 'GET',
			url: '/campaigns'
		}).then(function (data) {
			$scope.campaigns = data;
      $scope.alert = new NcAlert();
      if($stateParams.alert){
          $scope.alert.success($stateParams.alert);
      }
		});
	}]);

},{}],19:[function(require,module,exports){
/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';
angular.module('app.brand')
  .controller('brandInfluencerListController', ["$scope", "$api", function($scope, $api) {
    $scope.users = [];
    $api({
      method: 'GET',
      url: '/users/influencer',
    })
    .then(function(data) {
      $scope.users = data.rows;
    });
  }])
  .controller('brandInfluencerDetailController', ["$scope", "$api", "$stateParams", function($scope, $api, $stateParams) {
    $scope.user = {};
    $api({
      method: 'GET',
      url: '/users/influencer/' + $stateParams.id
    })
    .then(function(data) {
      $scope.user = data;
    });
  }]);

},{}],20:[function(require,module,exports){
/**
 * Brand submission controllers
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
  .controller('brandCampaignSubmissionDetailController', ["$scope", "$uibModal", "NcAlert", "$state", "$api", "$stateParams", function($scope, $uibModal, NcAlert,$state, $api, $stateParams) {
    $scope.influencerArray = [];
    $scope.formData = {};
    $scope.alert = new NcAlert();

    $api({
      method: 'GET',
      url: '/submissions/' + $stateParams.submissionId
    }).then(function (data) {
      $scope.formData = data;
      $scope.influencerArray = [$scope.formData.influencer];
    }).catch(function (err) {
      console.error("cant get campaign data", err);
    });

    $scope.waitForPost = function(submission){
      var tmpl = 'partials/modal-approve-submission.html';
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: tmpl,
        controller: ["$scope", "$api", "$uibModalInstance", "alert", "submission", function ($scope, $api, $uibModalInstance,  alert, submission) {
          $scope.formData = submission;

          $scope.saveComment = function () {
            $scope.formData.status = "wait for post";
            $api({
              url: '/campaigns/' + submission.campaignId + '/submissions/' + submission.submissionId,
              method: 'PUT',
              data: $scope.formData
            }).then(function (data) {
              $uibModalInstance.close(data);
            }).catch(function (err) {
              $uibModalInstance.dismiss(err);
            });
          }
        }],
        size: 'lg',
        resolve: {
          'submission': function () {
            return submission;
          },
          'alert': function(){
            return $scope.alert;
          }
        }
      });

      modalInstance.result.then(function (data) {
        $state.go("campaign-list.production", { alert: 'Submission approved.'});
      }, function (err) {
        console.log('Modal dismissed at: ' + new Date());
        if(err){
          $scope.alert.error(err.message);
        }
      });
    }

    $scope.askForRevision = function (submission) {
      var tmpl = 'partials/modal-revision-proposal.html';
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: tmpl,
        controller: ["$scope", "$api", "$uibModalInstance", "alert", "submission", function ($scope, $api, $uibModalInstance,  alert, submission) {
          $scope.formData = submission;

          $scope.saveComment = function () {
            $scope.formData.status = "need revision";
            $api({
              url: '/campaigns/' + submission.campaignId + '/submissions/' + submission.submissionId,
              method: 'PUT',
              data: $scope.formData
            }).then(function (data) {
              $uibModalInstance.close(data);
            }).catch(function (err) {
              $uibModalInstance.dismiss(err);
            });
          }
        }],
        size: 'lg',
        resolve: {
          'submission': function () {
            return submission;
          },
          'alert': function(){
            return $scope.alert;
          }
        }
      });

      modalInstance.result.then(function (data) {
        $state.go("campaign-list.production", { alert: 'Revision requested.'});
      }, function (err) {
        console.log('Modal dismissed at: ' + new Date());
        if(err){
          $scope.alert.error(err.message);
        }
      });
    }

  }])
	.controller('brandCampaignSubmissionListController', ["$scope", "$api", "NcAlert", "$stateParams", function($scope, $api, NcAlert, $stateParams) {
    $scope.formDataArray = [];
    $scope.alert = new NcAlert();
    $scope.formData = {};
    $scope.submissions = [];

    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $api({
      method: "GET",
      url: '/campaigns/' + $stateParams.campaignId + "/submissions"
    }).then(function(data){
      $scope.submissions = data.rows;
    }).catch(function(err){
      $scope.alert.error("Can't get submissions data");
    });

    $api({
      method: 'GET',
      url: '/campaigns/' + $stateParams.campaignId
    }).then(function (data) {
      $scope.formData = data;
      $scope.formDataArray = [$scope.formData];
    }).catch(function (err) {
      console.error("cant get campaign data", err);
      $scope.alert.error("Can't get campaign data");
    });


	}]);

},{}],21:[function(require,module,exports){
/**
 * Brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

var components = [
  require('../../components/common')
];

angular.module('app.brand', components)
  .config(["$stateProvider", function($stateProvider) {
    /*
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

    /**
     * Account
     */
    $stateProvider
      .state('signin', {
        parent: 'main',
        url: '/signin',
        views: {
          '': {
            controller: 'brandAccountSigninController',
            templateUrl: 'views/brand-account-signin.html'
          },
          'menu@main': {
            template: ''
          }
        }
      })
      .state('profile', {
        parent: 'main',
        url: '/profile',
        views: {
          '': {
            controller: 'brandAccountProfileController',
            templateUrl: 'views/brand-account-profile.html'
          }
        }
      });
    /**
     * Influencer
     */
    $stateProvider
      .state('influencer', {
        parent: 'main',
        url: '/influencer',
        controller: 'brandInfluencerListController',
        templateUrl: 'views/brand-influencer-list.html'
      })
      .state('influencer-detail', {
        parent: 'main',
        url: '/influencer/:id',
        controller: 'brandInfluencerDetailController',
        templateUrl: 'views/brand-influencer-detail.html'
      });

    /**
     * Transaction
    */
    $stateProvider
      .state('transaction-list', {
        parent: 'main',
        url: '/transactions',
        controller: 'brandTransactionListController',
        templateUrl: 'views/brand-transaction-list.html'
    });

    /**
     * Campaign
     */
    $stateProvider
      .state('campaign-list', {
        parent: 'main',
        url: '/campaign',
        params: {
          alert: null
        },
        controller: 'brandCampaignListController',
        templateUrl: 'views/brand-campaign-list.html'
      })
      .state('campaign-list.create', {
        url: '/create',
        views: {
           '@main': {
              controller: 'brandCampaignDetailDraftController',
              templateUrl: 'views/brand-campaign-detail-draft.html'
            }
        }
      })
      .state('campaign-list.draft', {
        url: '/draft/:campaignId',
         views: {
          '@main': {
            controller: 'brandCampaignDetailDraftController',
            templateUrl: 'views/brand-campaign-detail-draft.html'
          }
        }
      })
      .state('campaign-list.open', {
        url: '/open/:campaignId',
        params: {'alert': null},
        views: {
          '@main': {
            controller: 'brandCampaignDetailOpenController',
            templateUrl: 'views/brand-campaign-detail-open.html'
          }
        }
      })
      .state('campaign-list.open.proposal-detail', {
        url: '/open/:campaignId',
        params: { user : null},
        views: {
          '@main': {
            controller: 'brandCampaignProposalDetailController',
            templateUrl: 'views/brand-campaign-proposal-detail.html'
          }
        }
      })
      .state('campaign-list.production', {
        url: '/production/:campaignId',
        params: { alert : null},
        views: {
          '@main': {
            controller: 'brandCampaignSubmissionListController',
            templateUrl: 'views/brand-campaign-detail-production.html'
          }
        }
      })
      .state('campaign-list.production.submission-detail', {
        url: '/submission/:submissionId',
        views: {
          '@main': {
             controller: 'brandCampaignSubmissionDetailController',
             templateUrl: 'views/brand-submission-detail.html'
          }
        }
      })
      .state('campaign-list.open.pay', {
        url: '/payment',
        params: { campaign : null, allProposals: null, selected: null, budget: null, reach: null},
        resolve: {
          campaign: ["$stateParams", "$api", function($stateParams, $api) {
            return $api({
              method: 'GET',
              url: '/campaigns/' + $stateParams.campaignId
            });
          }]
        },
        views: {
          '@main': {
            controller: 'brandCampaignPaymentController',
            templateUrl: 'views/brand-campaign-pay.html'
          }
        }
      });
  }]);

(function () {var f = require("./index.js");f["brandAccountController"]=require("./brandAccountController.js");f["brandCampaignController"]=require("./brandCampaignController.js");f["brandInfluencerController"]=require("./brandInfluencerController.js");f["brandSubmissionController"]=require("./brandSubmissionController.js");f["index"]=require("./index.js");return f;})();

module.exports = 'app.brand';

},{"../../components/common":16,"./brandAccountController.js":17,"./brandCampaignController.js":18,"./brandInfluencerController.js":19,"./brandSubmissionController.js":20,"./index.js":21}]},{},[1])


angular.module("app.common").run(["$templateCache", function($templateCache) {
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
$templateCache.put("templates/image-thumb.html", "<div class=\"fileinput fileinput-new\" data-provides=fileinput><div class=fileinput-new style=\"width: {{width}}px; height:{{height}}px; text-align:center\"><img ng-show=!loadingImage src=\"{{ accessor(model) }}\" height={{height}} width={{width}}><div layout=row layout-sm=column ng-show=loadingImage layout-align=space-around style=\"padding-top: 100px;\">Please Wait..</div></div><br><div class=\"fileinput-preview fileinput-exists thumbnail\" style=\"max-width: 200px; max-height: 150px;\"></div><label class=\"btn btn-default btn-file\"><span class=fileinput-new><i class=\"glyphicon glyphicon-open-file\"></i> Upload from PC</span> <span class=fileinput-exists>Change</span> <input type=file name=slip data-ngf-select=upload($file)> <a href=# class=\"btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></label></div>");
$templateCache.put("templates/fs-media-selector.html", "<div class=control-group><label class=control-label for=media>Media</label><select class=form-control ng-model=model ng-options=\"media as media.mediaName for media in medium track by media.mediaId\" id=media></select></div>");
$templateCache.put("templates/fs-interests-selector.html", "<div class=control-group><label class=control-label for=aboutyourself>Your Interest (Can select up to 3)</label><p>You will be notified according to the interest that you selected.</p><div class=controls><div class=checkbox ng-repeat=\"topic in topics\"><label><input type=checkbox ng-change=topicToggle(topic) ng-model=dummy ng-disabled=topicDisabled(topic)>{{ topic.categoryName }}</label></div></div></div>");
$templateCache.put("templates/fs-campaign-category-selector.html", "<div class=control-group><label class=control-label for=camcat>Campaign Category</label><select class=form-control ng-model=model ng-options=\"category as category.categoryName for category in categories track by category.categoryId\" id=camcat></select></div>");
$templateCache.put("templates/fs-bank-selector.html", "<div class=control-group><label class=control-label for=bankname>Bank Name</label><select class=form-control ng-model=model ng-options=\"bank as bank.bankName for bank in banks track by bank.bankId\" id=bankname></select></div>");
}]);angular.module("app.brand").run(["$templateCache", function($templateCache) {
$templateCache.put("views/brand-transaction-list.html", "<div class=container><div class=page-header><h2 class=pull-left>Transaction List</h2><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All (1)</a> | <a href=#>Wait to Confirm (1)</a> | <a href=#>Paid (0)</a> | <a href=#>Cancelled (0)</a><br><br></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-12><table class=table><thead><tr><th>Campaign</th><th>Status</th><th>Date &amp; Time</th><th class=table-item-price>Price</th></tr></thead><tbody><tr ng-repeat=\"r in transactions\"><td><a href=brand-transaction-detail.html>{{ r.campaign.title }}</a></td><td>{{ r.status }}</td><td>{{ r.updatedAt | date : \'d/M/y H:m\'}}</td><td class=table-item-price>{{ r.amount | number: 2}}</td></tr></tbody></table></div></div></div></div></div>");
$templateCache.put("views/brand-submission-detail.html", "<div class=container><nc-alert nc-model=alert></nc-alert><div class=page-header><h2 class=pull-left>Submission Detail</h2><div class=pull-right><a ui-sref=^><button type=button name=button class=\"btn btn-default\">Back to Campaign Detail</button></a></div><div class=clear></div></div><scientific-card ng-model=influencerArray card-type=influencer></scientific-card><div class=\"panel panel-default\"><div class=panel-body><h4>Proposal Detail</h4>{{ formData.campaignProposal.description }}<br><br><h4>Proposed Price: {{formData.campaignProposal.proposePrice | number }} <small>Baht</small></h4></div></div><div class=\"panel panel-default\"><div class=panel-body><h3>{{formData.influencer.user.name}}\'s Submission <span class=pull-right>Status: <span ng-class=\"{\'color-red\': formData.status == \'need revision\'}\">{{ formData.status }}</span></span></h3>{{ formData.description }}<br><br><img ng-repeat=\"res in formData.resources\" src={{res.url}} width=500><br><br><div class=pull-left ng-if=\"formData.status != \'posted\'\"><a ng-click=waitForPost(formData) class=\"btn btn-primary\" data-toggle=modal data-target=#modal-approve-submission>Approve Proposal</a> <a ng-click=askForRevision(formData) class=\"btn btn-default\">Ask for Revision</a></div></div></div><div class=\"panel panel-default\" ng-if=\"formData.status == \'posted\'\"><div class=panel-body><h3>Your Feedback</h3><blockquote>{{ formData.comment }}</blockquote><h4>Posting Time: {{ formData.proof[0].updatedAt | date: \'d/M/y H:m\'}}</h4></div></div></div>");
$templateCache.put("views/brand-influencer-list.html", "<div class=container><div class=page-header><h2 class=pull-left>Meet Our Influencers</h2><div class=pull-right><a href=/brand#/campaign/create class=\"btn btn-primary\">+ Create New Campaign</a></div><div class=clear></div></div><div ng-repeat=\"user in users\" class=\"panel panel-default\"><div class=media><div class=media-left><img class=media-object ng-src={{user.profilePicture.url}}></div><div class=media-body><a href=/brand#/influencer/{{user.userId}}><h4 class=media-heading>{{user.name}}</h4></a><p>{{user.influencer.about}}</p><br><span>Facebook Follower: <strong>{{user.influencer.socialAccounts.facebook.follower || \'-\'}}</strong> | Instagram Follower: <strong>{{user.influencer.socialAccounts.instagram.follower || \'-\'}}</strong> | YouTube Follower: <strong>{{user.influencer.socialAccounts.youtube.follower || \'-\'}}</strong></span></div></div></div></div>");
$templateCache.put("views/brand-influencer-detail.html", "<div class=container><div class=page-header><h2 class=pull-left>Influencer Detail</h2><div class=pull-right><a href=/brand#/influencer class=\"btn btn-default\">Back to Influencer List</a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=media><div class=media-left><img class=media-object src={{user.profilePicture.url}}></div><div class=media-body><a href=#><h4 class=media-heading>{{user.name}}</h4></a><p>{{user.influencer.about}}</p><br><span>Facebook Follower: <strong>{{user.influencer.socialAccounts.facebook.follower || \'-\'}}</strong> | Instagram Follower: <strong>{{user.influencer.socialAccounts.instagram.follower || \'-\'}}</strong> | YouTube Follower: <strong>{{user.influencer.socialAccounts.youtube.follower || \'-\'}}</strong></span></div></div></div><div class=row><div class=col-md-3 ng-repeat=\"work in user.influencer.campaignSubmission | filter:{ status:\'paid\' }\"><div class=\"panel panel-default\"><img ng-src={{work.resources[0].url}} class=img-responsive><br><p class=text-center>{{work.description}}</p></div></div></div></div>");
$templateCache.put("views/brand-campaign-proposal-detail.html", "<div class=container><div class=page-header><h2 class=pull-left>Proposal Detail</h2><div class=pull-right><a ng-click=goBack()><button type=button name=button class=\"btn btn-default\">Back to Campaign Detail</button></a></div><div class=clear></div></div><nc-alert nc-model=alert></nc-alert><div class=\"alert alert-success\" ng-if=proposal.isSelected><a href=# class=close data-dismiss=alert aria-label=close>&times;</a> You have selected Someone. When you are satisfy with your selections, you can <a ui-sref=^>go back</a> to campaign detail and click \"Review & Pay\"</div><scientific-card card-type=user-influencer ng-model=influencers></scientific-card><div class=\"panel panel-default\"><div class=panel-body><h4>Proposal Detail <span class=pull-right>Status: <span ng-if=\"proposal.status === \'wait for review\' && !proposal.isSelected\">Wait for Review</span> <span ng-if=proposal.isSelected>Selected</span> <span ng-if=\"proposal.status === \'need revision\' && !proposal.isSelected\">Need Revision</span></span></h4>{{ proposal.description }}<br><div ng-repeat=\"res in proposal.resources\"><h4>Attachment</h4><img src={{res.url}} width=300><br></div><br><br><h4>Proposed Price: {{ proposal.proposePrice | number: 2}} Baht</h4><div class=pull-left ng-if=!proposal.isSelected><a ng-click=selectProposal(proposal) class=\"btn btn-primary\">Select Proposal</a> &nbsp <a href=# class=\"btn btn-default\" ng-click=askForRevision(proposal)>Ask for Revision</a></div><div class=pull-left ng-if=proposal.isSelected><a ng-click=unselectProposal(proposal)>Unselect this Proposal</a></div><br><br></div></div></div>");
$templateCache.put("views/brand-campaign-pay.html", "<div class=container><div class=page-header><h2 class=pull-left>Review & Pay</h2><div class=pull-right><a ng-click=goBack()><button type=button name=button class=\"btn btn-default\">Back to Campaign Detail</button></a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=media><div class=media-body><div class=media-item><h5>All Proposals:</h5><h4>{{ allProposals }}</h4></div><div class=media-item><h5>Selected:</h5><h4>{{ countSelected }}</h4></div><div class=media-item><h5>Budget:</h5><h4>{{ countBudget }}</h4></div><div class=media-item><h5>Potential Reach</h5><h4>{{countReach}} People</h4></div></div></div></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-6><table class=\"table table-price\"><thead><tr><th>Proposal</th><th class=table-item-price>Price</th></tr></thead><tbody><tr ng-repeat=\"cam in campaign.selectedProposals\"><td>{{ cam.influencer.user.name }}</td><td class=table-item-price>{{ cam.proposePrice | number: 2 }}</td></tr><tr><td>Fee</td><td class=table-item-price>0.00</td></tr><tr><td>Total</td><td class=table-item-price><strong>{{ sumFee | number: 2}}</strong></td></tr></tbody></table></div></div></div></div><div class=\"panel panel-default\" ng-if=\"campaign.paymentTransactions.length == 0\"><div class=panel-body><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div class=control-group><h3>Payment Method</h3><p>Only bank transfer option is available in your region at this time.</p></div></fieldset></form><br><div class=controls><a ng-click=readyToPay()><button class=\"btn btn-success\">Ready to Pay</button></a></div></div></div></div></div><div ng-if=\"campaign.paymentTransactions.length > 0\" class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div class=control-group><h3>Confirm Payment</h3><label class=control-label>Remaining Time</label><br><h4 class=color-red>3 Days 1 hour 46 minutes left</h4><label class=control-label>Upload your slip</label><br><image-thumb width=250 height=250 ng-model=paymentObject></image-thumb></div></fieldset></form><br><div class=controls><a ng-click=sendSlip(paymentObject)><button class=\"btn btn-success\">Confirm Payment</button></a></div></div></div></div></div></div>");
$templateCache.put("views/brand-campaign-list.html", "<div class=container><div class=page-header><h2 class=pull-left>My Campaign</h2><div class=pull-right><a href=/brand#/campaign/create class=\"btn btn-primary\">+ Create New Campaign</a></div><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All (3)</a> | <a href=#>Draft (1)</a> | <a href=#>Open (1)</a> | <a href=#>Production (1)</a> | <a href=#>Complete (0)</a><br><br></div><nc-alert nc-model=alert></nc-alert><div class=\"panel panel-default\" ng-if=\"campaigns.row.length > 0\"><div class=\"panel-body text-center\">You do not have any campaign. <a href=/brand#/campaign/create>Click here to create campaign</a></div></div><div class=\"panel panel-default\" ng-repeat=\"card in campaigns.rows\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object ng-src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"campaign-list.{{ $root.getRouteByStatus(card) }}({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>Campaign Status: <span ng-if=\"card.status === \'payment pending\'\">Open</span> <span ng-if=\"card.status === \'open\'\">Open</span> <span ng-if=\"card.status === \'production\'\">Production</span> <span ng-if=\"card.status === \'complete\'\">Complete</span> <span ng-if=\"card.status === \'draft\'\">Draft</span> <span ng-if=\"card.status === \'wait for payment\'\">Open</span> <span ng-if=\"card.status === \'wait for confirm\'\">Open</span></span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget }}</h4></div><div class=media-item><h5>Deadline</h5><h4 ng-if=\"card.status != \'production\'\">{{ card.proposalDeadline | date: \'d/M/y\' }}</h4><h4 ng-if=\"card.status == \'production\'\">{{ card.submissionDeadline | date: \'d/M/y\' }}</h4></div><div class=media-item><h5>Wait for Review</h5><h4>-</h4></div><div class=media-item><h5>Selected</h5><h4>-</h4></div><div class=media-item ng-if=card.category><h5>Category</h5><h4>{{ card.category.categoryName }}</h4></div></div></div></div></div>");
$templateCache.put("views/brand-campaign-detail-production.html", "<div class=container><div class=page-header><h2 class=pull-left>Campaign Detail (PRODUCTION)</h2><div class=pull-right><a href=/brand#/campaign class=\"btn btn-default\">Back to Campaign List</a></div><div class=clear></div></div><scientific-card card-type=brand-my-campaign ng-model=formDataArray></scientific-card><nc-alert nc-model=alert></nc-alert><div class=\"panel panel-default\"><div class=media><div class=media-body><div class=media-item><h5>Selected Proposals:</h5><h4>{{ formData.campaignProposals.length }}</h4></div><div class=media-item><h5>Posted:</h5><h4>{{ formData.campaignSubmissions.length }}</h4></div><div class=media-item><h5>Budget:</h5><h4>{{ formData.budget }}</h4></div><div class=media-item><h5>Potential Reach</h5><h4>2.5 Million+ Users</h4></div></div></div></div><div class=page-header><h3 class=pull-left>Submissions</h3><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All (2)</a> | <a href=#>Wait for Submission (0)</a> | <a href=#>Need Revision (1)</a> | <a href=#>Wait for Review (1)</a> | <a href=#>Wait for Post (0)</a> | <a href=#>Posted (0)</a><br><br></div><div class=\"panel panel-default\" ng-repeat=\"card in submissions\"><div class=media><div class=media-left><img class=media-object src=\"{{ card.profilePicture.url }}\"></div><div class=media-body><a ui-sref=\"campaign-list.production.submission-detail({ submissionId: card.influencer.campaignSubmissions[0].submissionId })\"><h4 class=media-heading>{{ card.name }}\'s Submission <span class=pull-right>Status: <span ng-class=\"{\'color-red\' :card.influencer.campaignSubmissions[0].status ==\'need revision\'}\">{{ card.influencer.campaignSubmissions[0].status }}</span></span></h4></a><div class=media-item><h5>Submission Number:</h5><h4>{{ card.influencer.campaignSubmissions.length }}</h4></div><br><div class=media-item><h5>Submitted on:</h5><h4>{{ card.influencer.campaignSubmissions[0].updatedAt | date: \'d/m/y\' }}</h4></div></div></div></div></div>");
$templateCache.put("views/brand-campaign-detail-open.html", "<div class=container><div class=page-header><h2 class=pull-left>Campaign Detail (OPEN)</h2><div class=pull-right><a ui-shref=campaign href=/brand#/campaign class=\"btn btn-default\">Back to Campaign List</a></div><div class=clear></div></div><nc-alert nc-model=alert></nc-alert><div class=\"alert alert-success\" ng-if=\"formData.status == \'wait for confirm\'\"><strong>Pending Payment Confirmation</strong> Administrator will approve your submission.</div><div class=\"alert alert-success\" ng-if=\"formData.status == \'payment pending\'\"><strong>Pending Payment</strong> Please confirm your payment by clicking on \'Review & Pay\'.</div><div class=\"panel panel-default\" data-name=campaign-detail ng-repeat=\"card in formDataArray\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object ng-src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"campaign-detail-{{ getStatus(card).toLowerCase()}}.detail({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>View Detail</span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget || \'N/A\' }}</h4></div><div class=media-item><h5>Deadline</h5><h4 ng-if=\"card.status != \'production\'\">{{ card.proposalDeadline | date: \'d/M/y\' }}</h4><h4 ng-if=\"card.status == \'production\'\">{{ card.submissionDeadline | date: \'d/M/y\' }}</h4></div><div class=media-item><h5>Wait for Review</h5><h4>-</h4></div><div class=media-item><h5>Selected</h5><h4>-</h4></div><div class=media-item ng-if=card.category><h5>Category</h5><h4>{{ card.category.categoryName }}</h4></div></div></div></div><div class=\"panel panel-default\"><div class=media><div class=media-body><div class=media-item><h5>All Proposals:</h5><h4>{{ proposals.length }}</h4></div><div class=media-item><h5>Selected:</h5><h4>{{ countSelected(proposals) }}</h4></div><div class=media-item><h5>Budget:</h5><h4>{{ sumBudgetSelected(proposals) | number:2}}</h4></div><div class=media-item><h5>Potential Reach</h5><h4>{{ countSelected(proposals)* 365 | number :0}} People</h4></div><div class=\"media-item pull-right\"><button ng-disabled=\"formData.status == \'wait for confirm\' || countSelected(proposals) == 0\" ui-sref=\"campaign-list.open.pay({campaign: formData, allProposals: proposals.length, selected: countSelected(proposals), budget: sumBudgetSelected(proposals) , reach: countSelected(proposals)* 365 })\" class=\"btn btn-primary\">Review & Pay</button></div></div></div></div><div class=page-header><h3 class=pull-left>Proposals</h3><div class=pull-right><div class=dropdown><button class=\"btn btn-default dropdown-toggle\" type=button data-toggle=dropdown>Sort by Date <span class=caret></span></button><ul class=dropdown-menu><li><a href=#>Sort by Most Followers</a></li><li><a href=#>Sort by Quotation</a></li><li><a href=#>Sort by Cost per Follower</a></li></ul></div></div><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All (3)</a> | <a href=#>Wait for Review (0)</a> | <a href=#>Need Revision (0)</a> | <a href=#>Selected ({{countSelected(proposals)}})</a><br><br></div><div class=\"panel panel-default\" ng-repeat=\"card in proposals\"><div class=media><div class=media-left><img class=media-object src=\"{{ card.profilePicture.url }}\"></div><div class=media-body><a ui-sref=\"campaign-list.open.proposal-detail({ user: card })\"><h4 class=media-heading>{{ card.name }} <span class=pull-right>Status: <span ng-if=\"card.influencer.campaignProposals[0].status === \'wait for review\' && !card.influencer.campaignProposals[0].isSelected\">Wait for Review</span> <span ng-if=card.influencer.campaignProposals[0].isSelected>Selected</span> <span ng-if=\"card.influencer.campaignProposals[0].status === \'need revision\' && !card.influencer.campaignProposals[0].isSelected\">Need Revision</span></span></h4></a><div class=media-item><h5>Instagram Followers:</h5><h4>0</h4></div><div class=media-item><h5>Submitted on:</h5><h4>{{ card.influencer.campaignProposals[0].updatedAt | date: \'d/M/y HH:mm\' }}</h4></div><br><br><div class=media-item><h5>Quotation:</h5><h4>{{ card.influencer.campaignProposals[0].proposePrice | number: 2 }}</h4></div><div class=media-item><h5>Cost per Follower:</h5><h4>Less than 0.00 Baht</h4></div></div></div></div></div>");
$templateCache.put("views/brand-campaign-detail-draft.html", "<div class=container><div class=page-header><h2 class=pull-left>Campaign Detail ({{ formData.status }})</h2><div class=pull-right><a href=/brand#/campaign class=\"btn btn-default\">Back to Campaign List</a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div class=control-group><label class=control-label>Campaign Name</label><div class=controls><input type=text ng-model=formData.title class=form-control></div></div><fs-campaign-category-selector ng-model=formData.category></fs-campaign-category-selector><fs-media-selector ng-model=formData.media[0]></fs-media-selector><div class=control-group><label class=control-label disabled for=budget>Budget per Influencer</label><select class=form-control ng-model=formData.budget id=budget><option disabled>- Select Budget -</option><option>500-1,000</option><option>1,000-5,000</option><option>5,000-10,000</option><option>10,000+</option></select></div><div class=control-group><label class=control-label>Campaign Image</label><p><image-thumb width=auto height=200 no-image-url=https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/No_image_available_600_x_200.svg/600px-No_image_available_600_x_200.svg.png ng-model=formData.resources[0]></image-thumb></p></div><div class=control-group><label class=control-label>Campaign Description</label><div class=controls><textarea type=text ng-model=formData.description class=form-control rows=3></textarea></div></div><div class=control-group><label class=control-label>Additional Image 1 (Optional)</label><br><image-thumb width=auto height=200 no-image-url=https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/No_image_available_600_x_200.svg/600px-No_image_available_600_x_200.svg.png ng-model=formData.resources[1]></image-thumb></div><div class=control-group><label class=control-label>Additional Image 2 (Optional)</label><br><image-thumb width=auto height=200 no-image-url=https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/No_image_available_600_x_200.svg/600px-No_image_available_600_x_200.svg.png ng-model=formData.resources[2]></image-thumb></div><div class=control-group><label class=control-label>Additional Image 3 (Optional)</label><br><image-thumb width=auto height=200 no-image-url=https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/No_image_available_600_x_200.svg/600px-No_image_available_600_x_200.svg.png ng-model=formData.resources[3]></image-thumb></div><br><div class=control-group><label class=control-label>Proposal Deadline</label><div class=controls><input type=date ng-model=formData.proposalDeadline class=form-control></div></div><div class=control-group><label class=control-label>Submission Deadline</label><div class=controls><input type=date ng-model=formData.submissionDeadline class=form-control></div></div></fieldset></form><br><br><div class=controls><a ng-click=savePublish() class=\"btn btn-success\">Publish</a> <a ng-click=saveDraft() class=\"btn btn-default\">Save as Draft</a></div></div></div></div></div></div>");
$templateCache.put("views/brand-account-signin.html", "<div class=container><br><h2 class=form-signin-heading>Please sign in</h2><div class=md-padding flex><form name=form class=form-horizontal ng-submit=submit(form) novalidate><fieldset><md-input-container class=md-block><label>Email</label> <input required md-no-asterisk name=email class=form-control ng-model=formData.email></md-input-container><md-input-container class=md-block><label>Password</label> <input type=password class=form-control required md-no-asterisk name=password ng-model=formData.password></md-input-container><div layout=column layout-align=\"center center\"><button class=\"btn btp-primary\" type=submit>Sign-in</button></div></fieldset></form></div></div>");
$templateCache.put("views/brand-account-profile.html", "<md-card-content class=md-padding layout-xs=column layout=row layout-align-xs=\"center none\" layout-align=\"left none\"><image-thumb width=250 height=250 ng-model=formData.profilePicture></image-thumb><div class=md-padding flex=100><form name=form class=form-horizontal ng-submit=submit(form) novalidate><fieldset><md-input-container class=md-block><label>Brand Name</label> <input required md-no-asterisk name=brandName ng-model=formData.brandName></md-input-container><md-input-container class=md-block><label>Name</label> <input required md-no-asterisk name=name ng-model=formData.name></md-input-container><md-input-container class=md-block><label>Contact Number</label> <input md-maxlength=10 required md-no-asterisk name=contactNumber ng-model=formData.contactNumber></md-input-container><md-input-container class=md-block><label>E-mail</label> <input required md-no-asterisk name=email ng-model=formData.email></md-input-container><md-input-container class=md-block><label>Confirm E-mail</label> <input required md-no-asterisk name=emailConfirm ng-model=formData.emailConfirm></md-input-container><md-button type=submit class=\"md-raised pull-right\" ng-disabled=true>Change Password</md-button><md-button type=submit class=\"md-raised md-primary pull-right\" ng-disabled=true>Save</md-button></fieldset></form></div></md-card-content>");
$templateCache.put("partials/title.html", "Campaign Listing");
$templateCache.put("partials/modal-revision-proposal.html", "<div class=modal-content><div class=modal-header><button type=button class=close ng-click=$dismiss()>&times;</button><h4 class=modal-title>Ask for Revision</h4></div><div class=modal-body><div class=form-group><label for=comment>Which part do you want the influencer to revise:</label> <textarea class=form-control ng-model=formData.comment rows=3 id=comment></textarea></div><div class=form-group><label for=attachment>Image Attachment:</label><br><pre>Intentionally unsupported. </pre></div></div><div class=modal-footer><a class=\"btn btn-default\" ng-click=$dismiss() data-dismiss=modal>Cancel</a> <a ng-click=saveComment() class=\"btn btn-primary\">Submit</a></div></div>");
$templateCache.put("partials/modal-approve-submission.html", "<div class=modal-content><div class=modal-header><button type=button class=close data-dismiss=modal>&times;</button><h4 class=modal-title>Approve Submission</h4></div><div class=modal-body><div class=form-group><label for=comment>Compliment of the influencer work:</label> <textarea class=form-control rows=3 ng-model=formData.comment id=comment></textarea></div><br><div class=form-group><label for=comment>Date that the influencer has to post this content:</label> <input class=form-control type=text disabled value=\"Feature not implemented by D Team\"> <label class=checkbox-inline><input disabled type=checkbox>Can post on any date</label></div><div class=form-group><label for=comment>Time that the influencer has to post this content:</label> <input class=form-control type=text disabled value=\"Feature not implemented by D Team\"> <label class=checkbox-inline><input type=checkbox>Can post on any time</label></div></div><div class=modal-footer><a class=\"btn btn-default\" ng-click=$dismiss() data-dismiss=modal>Cancel</a> <a ng-click=saveComment() class=\"btn btn-primary\">Submit</a></div></div>");
$templateCache.put("partials/account-profile-title.html", "Brand Profile");
$templateCache.put("partials/account-profile-menu.html", "<md-tab label=\"My Profile\"></md-tab>");
$templateCache.put("abstract/main-brand.html", "<nav class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container-fluid><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=brand-landing.html><i class=\"fa fa-pied-piper\" aria-hidden=true></i> ReachRabbit <small>Brands</small></a></div><div id=navbar class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li ui-sref-active=active><a ui-sref=campaign-list>My Campaign</a></li><li ui-sref-active=active><a ui-sref=influencer>Influencers</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown uib-dropdown><a class=dropdown-toggle uib-dropdown-toggle>{{ $root.getProfile().name }} <span class=caret></span></a><ul class=dropdown-menu uib-dropdown-menu><li><a ui-sref=profile()>Profile</a></li><li><a ui-sref=transaction-list()>Transactions</a></li><li><a href=#>Notification</a></li></ul></li></ul></div></div></nav><div class=uivc data-ui-view></div>");
}]);
//# sourceMappingURL=brandApp.js.map

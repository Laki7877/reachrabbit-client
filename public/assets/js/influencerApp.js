(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){

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

},{}],15:[function(require,module,exports){
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

},{"./config/authConfig.js":1,"./config/loadingConfig.js":2,"./directives/formField.js":3,"./directives/formSet.js":4,"./directives/imageThumb.js":5,"./directives/ncAlert.js":6,"./directives/ngMatch.js":7,"./directives/scientificCard.js":8,"./directives/socialLinker.js":9,"./helpers/api.js":10,"./helpers/json.js":11,"./helpers/storage.js":12,"./helpers/uploader.js":13,"./helpers/virtualStatus.js":14,"./index.js":15}],16:[function(require,module,exports){
/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/influencer')
];

angular.module('app', components)
  .run(["$state", "$rootScope", "$storage", function($state, $rootScope, $storage) {
      
  }]);

},{"./modules/influencer":17}],17:[function(require,module,exports){
/**
 * influencer module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
 */
'use strict';

var components = [
  require('../../components/common')
];

angular.module('app.influencer', components)
  .config(["$stateProvider", function($stateProvider) {
    $stateProvider
      .state('main', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'abstract/main-influencer.html'
          }
        }
      })
      .state('profile', {
        parent: 'main',
        url: '/profile',
        views: {
          '': {
            controller: 'influencerAccountProfileController',
            templateUrl: 'views/influencer-profile.html'
          }
        }
      })
      .state('signin', {
        parent: 'main',
        url: '',
        views: {
          '': {
            controller: 'influencerAccountSigninController',
            templateUrl: 'views/influencer-account-signin.html'
          }
        }
      })
      .state('open-campaign', {
        parent: 'main',
        params: {alert: null},
        url: '/campaign/open', //done
        views: {
          '': {
            controller: 'influencerOpenCampaignListController',
            templateUrl: 'views/influencer-open-campaign-list.html'
          }
        }
      })
      .state('open-campaign.detail', {
        url: '/:campaignId', //done
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-open-campaign-detail.html'
          }
        }
      })
      .state('my-campaign', {
        parent: 'main',
        url: '/campaign/my', //done
        params: { alert: null},
        views: {
          '': {
            controller: 'influencerMyCampaignListController',
            templateUrl: 'views/influencer-my-campaign-list.html'
          }
        }
      })
      // .state('my-campaign.open', {
      //   url: '/open/:campaignId', //done
      //   views: {
      //     '@main': {
      //       controller: 'influencerCampaignDetailController',
      //       templateUrl: 'views/influencer-my-campaign-applied.html'
      //     }
      //   }
      // })
      .state('my-campaign.applied', {
        url: '/:campaignId', //done
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-my-campaign-applied.html'
          }
        }
      })
      .state('my-campaign.production', {
        url: '/production/:campaignId',
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-my-campaign-production.html'
          }
        }
      })
      .state('my-campaign.complete', {
        url: '/complete/:campaignId',
        views: {
          '@main': {
            controller: 'influencerCampaignDetailController',
            templateUrl: 'views/influencer-my-campaign-complete.html'
          }
        }
      })
      .state('transaction-list', {
        parent: 'main',
        url: '/transaction',
        views: {
          '': {
            controller: 'influencerTransactionListController',
            templateUrl: 'views/influencer-transaction-list.html'
          }
        }
      })

  }]);

(function () {var f = require("./index.js");f["index"]=require("./index.js");f["influencerAccountController"]=require("./influencerAccountController.js");f["influencerCampaignController"]=require("./influencerCampaignController.js");return f;})();

module.exports = 'app.influencer';

},{"../../components/common":15,"./index.js":17,"./influencerAccountController.js":18,"./influencerCampaignController.js":19}],18:[function(require,module,exports){
/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';


angular.module('app.influencer')
  /*
  *
  * deprecated
  *
  */
  .controller('influencerAccountConfirmController', ["$scope", function($scope) {
    $scope.formData = {};
  }])
  /*
  * Influencer Profile
  *
  */
  .controller('influencerAccountProfileController', ["$scope", "$uploader", "$auth", "$api", function($scope,$uploader, $auth, $api) {

    $scope.formData = {
      selectedTopics: []
    };

    $scope.upload = function(file) {
      $scope.loadingImage = true;
      $uploader.upload('/file', file)
        .then(function(data) {
          $scope.loadingImage = false;
          $scope.formData.profilePicture = data;
        });
    };


    //Get user info
    $api({
      method: 'GET',
      url: '/profiles'
    }).then(function(data) {
      console.log(data)
      $scope.formData = _.extend($scope.formData, data);
    }).catch(function(err) {
      console.log(err);
    });


    function authNOK(err) {
      if (err.data && err.data.display) {
        alert(err.data.display.message)
      }
    }



  }])

},{}],19:[function(require,module,exports){
/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

angular.module('app.influencer')
	.controller('influencerOpenCampaignListController', ["$scope", "$stateParams", "$api", "VirtualStatus", "NcAlert", function($scope, $stateParams, $api,VirtualStatus, NcAlert) {
    $scope.campaigns = [];
    $scope.alert = new NcAlert();
    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $api({
        method: 'GET',
        url: '/campaigns',
        params: {
          status: 'open'
        }
      }).then(function(data) {
        $scope.campaigns = data.rows;
        $scope.campaigns.forEach(function(c){
          var mine = VirtualStatus.isApplied(c);
          //applied
          if(mine){
            c.virtualStatus = 'applied';
          }
        });

      }).catch(function(err) {
        $scope.message = err.message;
      });
	}])
  .controller('influencerTransactionListController', ["$scope", "$state", "$stateParams", "$api", function($scope, $state, $stateParams,  $api){
      console.log("Transaction loaded");
      $scope.transactions = [];
      $api({
        url: "/transactions",
        "method": "GET"
      }).then(function(data){
        $scope.transactions = data.rows;
      })
  }])
  .controller('influencerMyCampaignListController', ["$scope", "NcAlert", "$stateParams", "$api", function($scope, NcAlert, $stateParams, $api) {
    $scope.campaigns = [];
    $scope.alert = new NcAlert();
    if($stateParams.alert){
      $scope.alert.success($stateParams.alert);
    }

    $scope.getMyLatestProposal = function(card){
      if(!card.campaignProposals){
         return { status: 'Wait for Backend'};
      }

      return card.campaignProposals[0];
    }

    $scope.getMyLatestSubmission = function(card){
      if(!card.campaignSubmissions){
        return { status: 'Wait for Backend'};
      }
      return card.campaignSubmissions[0];
    }

    $api({
        method: 'GET',
        url: '/mycampaigns'
      }).then(function(data) {
        $scope.campaigns = data.rows;
      }).catch(function(err) {
        $scope.message = err.message;
      });
  }])
  .controller('influencerCampaignDetailController', ["$scope", "VirtualStatus", "NcAlert", "$storage", "$stateParams", "$state", "$api", function($scope, VirtualStatus, NcAlert, $storage, $stateParams, $state, $api){
    $scope.campaigns = [];
    $scope.proposals = [];
    $scope.campaign = {};

    $scope.proposal = {
      resources: []
    };
    $scope.submission = {
      resources: []
    };

    $scope.proof = {
      proof: {}
    };

    $scope.getMyLatestProposal = function(card){
      if(!card.campaignProposals){
        return { status: "Wait for Backend"};
      }

      return card.campaignProposals[0];
    }

    $scope.getMyLatestSubmission = function(card){
      if(!card.campaignSubmissions){
        return { status: "Wait for Backend"};
      }
      return card.campaignSubmissions[0];
    }

    $scope.postEvidence = function(proof,submission){
      $api({
        method: 'POST',
        url: '/submissions/' + submission.submissionId + '/proofs',
        data: proof
      }).then(function(data){
        $state.go('my-campaign', {alert: "Evidence Posted"})
      });
    }

    $scope.comments = [];

    $scope.isApplied = false;

    $scope.needRevision = function(){
      if($scope.proposal.status == 'need revision'){
        return true;
      }
      return false;
    }

    $api({
        method: 'GET',
        url: '/campaigns/' + $stateParams.campaignId
      }).then(function(data) {
        $scope.campaigns = [data];
        $scope.campaign = data;

        var mine = VirtualStatus.isApplied(data);
        console.log('mine', mine);
        //applied
        if(mine){
          $scope.campaign.status = 'applied';
          $scope.isApplied = true;
          if(mine.comment){
            $scope.comments.push(mine.comment);
          }
          $scope.proposal = mine;
          $scope.proposals = [mine];
        }

      }).catch(function(err) {
        $scope.message = err.message;
      });


      $scope.postProposal = function(proposal){
        proposal.status = 'wait for review';
        $api({
          method: 'POST',
          url: '/campaigns/' + $stateParams.campaignId + '/proposals',
          data: proposal
        }).then(function(data) {
          if(data.proposalId){
            $state.go('my-campaign', { alert: '<strong>Success</strong> - Proposal updated.'});
          }else{
            $state.go('open-campaign', { alert: '<strong>Success</strong> - Applied to Campaign.'});
          }
        }).catch(function(err) {
          $scope.message = err.message;
        });
      }

      $scope.submitWork = function(submission){
        $api({
          method: 'POST',
          url: '/campaigns/' + $stateParams.campaignId + '/submissions',
          data: submission
        }).then(function(data) {
          $state.go('open-campaign', {alert: "Your work has been submitted and is being reviewed."});
        }).catch(function(err) {
          $scope.message = err.message;
        });
      }

  }]);

},{}]},{},[16])


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
}]);angular.module("app.influencer").run(["$templateCache", function($templateCache) {
$templateCache.put("views/influencer-transaction-list.html", "<div class=container><div class=page-header><h2 class=pull-left>Transaction List</h2><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All (1)</a> | <a href=#>Wait to Confirm (1)</a> | <a href=#>Paid (0)</a> | <a href=#>Cancelled (0)</a><br><br></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-12><table class=table><thead><tr><th>Campaign</th><th>Status</th><th>Date &amp; Time</th><th class=table-item-price>Price</th></tr></thead><tbody><tr ng-repeat=\"r in transactions\"><td><a href=brand-transaction-detail.html>{{ r.campaign.title }}</a></td><td>{{ r.status }}</td><td>{{ r.updatedAt | date : \'d/M/y H:m\'}}</td><td class=table-item-price>{{ r.amount | number: 2}}</td></tr></tbody></table></div></div></div></div></div>");
$templateCache.put("views/influencer-profile.html", "<div class=container><div class=page-header><h2 class=pull-left>Influencer Profile</h2><div class=clear></div></div><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><image-thumb width=250 height=250 ng-model=formData.profilePicture></image-thumb><div class=control-group><label class=control-label for=username>Name</label><div class=controls><input type=text id=username ng-model=formData.name name=username class=form-control></div></div><br><div class=control-group><label class=control-label for=email>E-mail</label><div class=controls><input type=email id=email name=email ng-model=formData.email class=form-control></div></div><div class=control-group><label class=control-label for=email>Confirm E-mail</label><div class=controls><input type=email id=emailconfirm ng-model=formData.emailConfirm name=emailconfirm class=form-control></div></div><br><div class=control-group><label class=control-label for=contactnumber>Contact Number</label><div class=controls><input type=text id=contactnumber ng-model=formData.contactNumber name=contactnumber class=form-control></div></div><br><br><social-linker on-already-logged-in=onAlreadyLoggedIn on-success=socialSelectionDone ng-model=formData.socialAccounts></social-linker><div class=control-group><label class=control-label for=email>Your Website</label><div class=controls><input type=text ng-model=formData.website class=form-control></div></div><div class=control-group><label class=control-label for=aboutyourself>About Yourself</label><div class=controls><textarea type=text id=aboutyourself ng-model=formData.about name=username class=form-control rows=3></textarea></div></div><div class=control-group><label class=control-label for=gender>Gender</label><select class=form-control id=gender ng-model=formData.gender><option>- Select Gender -</option><option>Male</option><option>Female</option><option>Not Specified</option></select></div><br><fs-interests-selector ng-model=formData.influencer.interests></fs-interests-selector><br><fs-bank-selector ng-model=formData.bank></fs-bank-selector><div class=control-group><label class=control-label for=banknumber>Bank Account Number</label><div class=controls><input type=text ng-model=formData.influencer.bankAccount class=form-control></div></div><br></fieldset></form><div class=controls><a href=influencer-profile.html><button class=\"btn btn-success\">Save</button></a></div></div></div></div>");
$templateCache.put("views/influencer-open-campaign-list.html", "<div class=container><div class=page-header><h2 class=pull-left>Open Campaign</h2><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All</a> | <a href=#>Instagram</a> | <a href=#>Facebook</a> | <a href=#>YouTube</a><br><br></div><nc-alert nc-model=alert></nc-alert><div ng-if=\"campaigns.length == 0\" class=\"panel panel-default\"><div class=panel-body>No open campaign available.</div></div><div class=\"panel panel-default\" ng-repeat=\"card in campaigns\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"open-campaign.detail({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>Campaign Status: <span ng-if=\"card.status === \'payment pending\'\">Open</span> <span ng-if=\"card.status === \'open\'\">Open</span> <span ng-if=\"card.status === \'production\'\">Production</span> <span ng-if=\"card.status === \'complete\'\">Complete</span> <span ng-if=\"card.status === \'wait for payment\'\">Open</span> <span ng-if=\"card.status === \'wait for confirm\'\">Open</span></span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget }}</h4></div><div class=media-item><h5>Submission Deadline</h5><h4>{{ card.submissionDeadline | date }}</h4></div><div class=media-item ng-show=card.category><h5>Category</h5><h4>{{ card.category }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Soon</h4></div></div></div></div></div>");
$templateCache.put("views/influencer-open-campaign-detail.html", "<div class=container><div class=page-header><h2 class=pull-left>Campaign Detail ({{ $root.getRouteByStatus(campaign) | uppercase }})</h2><div class=pull-right><a ui-sref=^ class=\"btn btn-default\">Back to Campaign List</a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=media><div class=media-left><img ng-if=\"campaign.resources.length > 0\" class=media-object src=\"{{ campaign.resources[0].url }}\"></div><div class=media-body><h4 class=media-heading>{{ campaign.title }} <i class=\"fa fa-{{campaign.media[0].mediaId}}\"></i></h4><div class=media-item><h5>Status</h5><h4>{{ $root.getRouteByStatus(campaign) }}</h4></div><div class=media-item><h5>Reward</h5><h4>{{ campaign.budget || \'N/A\' }}</h4></div><div class=media-item><h5>Category</h5><h4>{{ campaign.category.categoryName }}</h4></div><div class=media-item><h5>Proposal Deadline</h5><h4>{{ campaign.proposalDeadline | date : \"d/M/y H:m:s\" }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Not Supported</h4></div></div></div></div><scientific-card ng-model=proposals card-type=influencer-proposal></scientific-card><scientific-card card-type=brand-comment ng-model=comments></scientific-card><div ng-show=!isApplied class=\"panel panel-default\"><div class=panel-body><strong style=font-size:16px>Campaign Detail</strong><div class=row><div class=col-md-8>{{ campaign.description}}<div ng-repeat=\"resource in campaign.resources\" ng-if=\"$index > 0\"><img src={{resource.url}} class=img-responsive></div></div></div></div></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-8><form class=form-horizontal method=POST><strong ng-if=!isApplied style=font-size:16px>Apply for this campaign</strong><h3 ng-if=isApplied>Revise Proposal</h3><fieldset><div class=control-group><label class=control-label for=brandname>Why should it be you?</label><div class=controls><textarea type=text ng-model=proposal.description class=form-control rows=3></textarea> <span>Ex: \"I\'m so handsome and you know it.\"</span></div></div><br><div class=control-group><label class=control-label for=brandname>Proposed Price</label><div class=controls><input type=text ng-model=proposal.proposePrice class=form-control></div><span class=color-red>You will be charge 18% [NOTE: We need to work on this.]</span></div><br><label for=attachment>Image Attachment (Optional):</label><br><image-thumb width=auto height=200 no-image-url=https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/No_image_available_600_x_200.svg/600px-No_image_available_600_x_200.svg.png ng-model=proposal.resources[0]></image-thumb></fieldset></form><br><div class=controls><a ng-click=postProposal(proposal) class=\"btn btn-success\">Submit</a></div></div></div></div></div></div>");
$templateCache.put("views/influencer-my-campaign-production.html", "<div class=container><div class=page-header><h2 class=pull-left>Campaign Detail (PRODUCTION)</h2><div class=pull-right><a ui-sref=^ class=\"btn btn-default\">Back to Campaign List</a></div><div class=clear></div></div><div class=\"panel panel-default\" ng-repeat=\"card in campaigns\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object ng-src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"my-campaign.{{ $root.getRouteByStatusApplied(card) }}({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>Campaign Status: <span ng-if=\"card.status === \'payment pending\'\">Applied</span> <span ng-if=\"card.status === \'open\'\">Applied</span> <span ng-if=\"card.status === \'production\'\">Production</span> <span ng-if=\"card.status === \'complete\'\">Complete</span> <span ng-if=\"card.status === \'wait for payment\'\">Applied</span> <span ng-if=\"card.status === \'wait for confirm\'\">Applied</span></span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget || \'N/A\' }}</h4></div><div class=media-item ng-if=\"card.status != \'production\'\"><h5>Proposal Status</h5><h4 ng-class=\"{\'color-red\': getMyLatestProposal(card).status == \'need revision\', \'color-yellow\': getMyLatestProposal(card).status == \'wait for review\' }\">{{ getMyLatestProposal(card).status }}</h4></div><div class=media-item ng-if=\"card.status == \'production\'\"><h5>Submission Status</h5><h4 ng-if=getMyLatestSubmission(card)>{{ getMyLatestSubmission(card).status }}</h4><h4 ng-if=!getMyLatestSubmission(card)>Wait for Submission</h4></div><div class=media-item ng-if=\"card.status != \'production\'\"><h5>Proposal Deadline</h5><h4>{{ card.proposalDeadline | date }}</h4></div><div class=media-item ng-if=\"card.status == \'production\'\"><h5>Submission Deadline</h5><h4>{{ card.submissionDeadline | date }}</h4></div><div class=media-item ng-show=card.category><h5>Category</h5><h4>{{ card.category.categoryName }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Soon</h4></div></div></div></div><div class=\"panel panel-default\"><div class=panel-body><h3>Proposal Detail</h3>{{ campaign.campaignProposals[0].description }}<br><br><h3>Proposed Price: {{ campaign.campaignProposals[0].proposePrice | number : 2}} Baht</h3><h4>Status: {{ campaign.campaignProposals[0].status }}</h4><br></div></div><div class=\"panel panel-default\" ng-repeat-start=\"submission in campaign.campaignSubmissions | reverse\"><div class=panel-body><h4>Your Submission #{{$index + 1}}</h4>{{ submission.description }}<br><br><img ng-repeat=\"res in submission.resources\" src=\"{{ res.url }}\" width=550><p><small>Submitted on {{submission.createdAt | date: \'d/M/y H:m\'}}</small></p></div></div><div class=\"panel panel-default\" ng-repeat-end ng-if=submission.comment><div class=panel-body><h3>Brand Comment on your Submission #{{$index + 1}}</h3><blockquote>{{ submission.comment }}</blockquote></div></div><div class=\"panel panel-default\" ng-if=\"campaign.campaignSubmissions[0].status != \'wait for post\'\"><div class=panel-body><div class=row><div class=col-md-8><form class=form-horizontal method=POST><h3>Submission #{{ campaign.campaignSubmissions.length + 1}}</h3><fieldset><div class=control-group><label class=control-label>Description</label><div class=controls><textarea type=text class=form-control ng-model=submission.description rows=3></textarea></div></div><br><label for=attachment>Image Attachment:</label><br><image-thumb ng-model=submission.resources[0] height=300 width=auto></image-thumb><br><label for=attachment>Video Attachment:</label><div class=\"fileinput fileinput-new input-group\" data-provides=fileinput><div class=form-control data-trigger=fileinput><i class=\"glyphicon glyphicon-file fileinput-exists\"></i> <span class=fileinput-filename></span></div><span class=\"input-group-addon btn btn-default btn-file\"><span class=fileinput-new>Select file</span><span class=fileinput-exists>Change</span><input type=file name=...></span> <a href=# class=\"input-group-addon btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></div><br></fieldset></form><br><div class=controls><a ng-click=submitWork(submission) class=\"btn btn-success\">Submit</a></div></div></div></div></div><div class=\"panel panel-default\" ng-if=\"campaign.campaignSubmissions[0].status == \'wait for post\'\"><div class=panel-body><div class=row><div class=col-md-8><form class=form-horizontal method=POST><h3>Post Evidence</h3><fieldset><label for=attachment>Image Attachment:</label><br><image-thumb ng-model=proof.proof height=300 width=auto></image-thumb><p>You will get money in 3 days after providing the evidence.</p></fieldset></form><br><div class=controls><a ng-click=\"postEvidence(proof.proof, campaign.campaignSubmissions[0])\" class=\"btn btn-success\">Submit</a></div></div></div></div></div></div>");
$templateCache.put("views/influencer-my-campaign-list.html", "<div class=container><div class=page-header><h2 class=pull-left>My Campaign</h2><div class=clear></div></div><div class=filter>Filter: <a href=# class=active>All (3)</a> | <a href=#>Applied (1)</a> | <a href=#>Production (0)</a> | <a href=#>Complete (0)</a><br><br></div><nc-alert nc-model=alert></nc-alert><div ng-if=\"campaigns.length == 0\" class=\"panel panel-default\"><div class=panel-body>No open campaign available.</div></div><div class=\"panel panel-default\" ng-repeat=\"card in campaigns\"><div class=media><div class=media-left><img ng-if=\"card.resources.length > 0\" class=media-object ng-src=\"{{ card.resources[0].url }}\"></div><div class=media-body><a ui-sref=\"my-campaign.{{ $root.getRouteByStatusApplied(card) }}({ campaignId: card.campaignId })\"><h4 class=media-heading>{{ card.title }} <i class=\"fa fa-{{card.media[0].mediaId}}\"></i> <span class=pull-right>Campaign Status: <span ng-if=\"card.status === \'payment pending\'\">Applied</span> <span ng-if=\"card.status === \'open\'\">Applied</span> <span ng-if=\"card.status === \'production\'\">Production</span> <span ng-if=\"card.status === \'complete\'\">Complete</span> <span ng-if=\"card.status === \'wait for payment\'\">Applied</span> <span ng-if=\"card.status === \'wait for confirm\'\">Applied</span></span></h4></a><div class=media-item><h5>Reward</h5><h4>{{ card.budget || \'N/A\' }}</h4></div><div class=media-item ng-if=\"card.status != \'production\'\"><h5>Proposal Status</h5><h4 ng-class=\"{\'color-red\': getMyLatestProposal(card).status == \'need revision\', \'color-yellow\': getMyLatestProposal(card).status == \'wait for review\' }\">{{ getMyLatestProposal(card).status }}</h4></div><div class=media-item ng-if=\"card.status == \'production\'\"><h5>Submission Status</h5><h4 ng-if=getMyLatestSubmission(card)>{{ getMyLatestSubmission(card).status }}</h4><h4 ng-if=!getMyLatestSubmission(card)>Wait for Submission</h4></div><div class=media-item ng-if=\"card.status != \'production\'\"><h5>Proposal Deadline</h5><h4>{{ card.proposalDeadline | date }}</h4></div><div class=media-item ng-if=\"card.status == \'production\'\"><h5>Submission Deadline</h5><h4>{{ card.submissionDeadline | date }}</h4></div><div class=media-item ng-show=card.category><h5>Category</h5><h4>{{ card.category }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Soon</h4></div></div></div></div></div>");
$templateCache.put("views/influencer-my-campaign-complete.html", "");
$templateCache.put("views/influencer-my-campaign-applied.html", "<div class=container><div class=page-header><h2 class=pull-left>Campaign Detail ({{ $root.getRouteByStatusApplied(campaign) | uppercase }})</h2><div class=pull-right><a ui-sref=^ class=\"btn btn-default\">Back to Campaign List</a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=media><div class=media-left><img ng-if=\"campaign.resources.length > 0\" class=media-object src=\"{{ campaign.resources[0].url }}\"></div><div class=media-body><h4 class=media-heading>{{ campaign.title }} <i class=\"fa fa-{{campaign.media[0].mediaId}}\"></i></h4><div class=media-item><h5>Status</h5><h4>{{ $root.getRouteByStatusApplied(campaign) }}</h4></div><div class=media-item><h5>Reward</h5><h4>{{ campaign.budget || \'N/A\' }}</h4></div><div class=media-item><h5>Category</h5><h4>{{ campaign.category.categoryName }}</h4></div><div class=media-item><h5>Proposal Deadline</h5><h4>{{ campaign.proposalDeadline | date : \"d/M/y H:m:s\" }}</h4></div><div class=media-item><h5>Proposal Result</h5><h4>Not Supported</h4></div></div></div></div><scientific-card ng-model=proposals card-type=influencer-proposal></scientific-card><div class=\"panel panel-default\" ng-repeat=\"msg in comments\"><div class=panel-body><h3>Brand Comment</h3><blockquote>{{msg}}</blockquote></div></div><div ng-show=!isApplied class=\"panel panel-default\"><div class=panel-body><strong style=font-size:16px>Campaign Detail</strong><div class=row><div class=col-md-8>{{ campaign.description}}<div ng-repeat=\"resource in campaign.resources\" ng-if=\"$index > 0\"><img src={{resource.url}} width=550 class=img-responsive></div></div></div></div></div><div class=\"panel panel-default\" ng-if=needRevision()><div class=panel-body><div class=row><div class=col-md-8><form class=form-horizontal method=POST><strong ng-if=!isApplied style=font-size:16px>Apply for this campaign</strong><h3 ng-if=isApplied>Revise Proposal</h3><fieldset><div class=control-group><label class=control-label for=brandname>Why should it be you?</label><div class=controls><textarea type=text ng-model=proposal.description class=form-control rows=3></textarea> <span>Ex: \"I\'m so handsome and you know it.\"</span></div></div><br><div class=control-group><label class=control-label for=brandname>Proposed Price</label><div class=controls><input type=text ng-model=proposal.proposePrice class=form-control></div><span class=color-red>You will be charge 18% [NOTE: We need to work on this.]</span></div><br><label for=attachment>Image Attachment (Optional):</label><br><image-thumb width=auto height=200 no-image-url=https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/No_image_available_600_x_200.svg/600px-No_image_available_600_x_200.svg.png ng-model=proposal.resources[0]></image-thumb></fieldset></form><br><div class=controls><a ng-click=postProposal(proposal) class=\"btn btn-success\">Submit</a></div></div></div></div></div></div>");
$templateCache.put("partials/menu.html", "<nav class=\"navbar navbar-default\"><div class=container-fluid><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=/#/influencer>Project X</a></div><div id=navbar class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li class=active><a>Open Campaign</a></li><li><a href=#>My Campaign</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown><a href=# class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{profile.name}} (Influencer) <span class=caret></span></a><ul class=dropdown-menu><li><a href=#>Profile</a></li><li><a href=#>Payment</a></li><li><a href=#>Notification</a></li></ul></li></ul></div></div></nav>");
$templateCache.put("abstract/main-influencer.html", "<nav class=\"navbar navbar-inverse navbar-fixed-top\"><div class=container-fluid><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=brand-landing.html><i class=\"fa fa-pied-piper\" aria-hidden=true></i> ReachRabbit <small>Influencers</small></a></div><div id=navbar class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li ui-sref-active=active><a ui-sref=open-campaign>Open Campaign</a></li><li ui-sref-active=active><a ui-sref=my-campaign>My Campaign</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown uib-dropdown><a class=dropdown-toggle uib-dropdown-toggle>{{ $root.getProfile().name }} <span class=caret></span></a><ul class=dropdown-menu uib-dropdown-menu><li><a ui-sref=profile()>Profile</a></li><li><a ui-sref=transaction-list()>Transactions</a></li><li><a href=#>Notification</a></li></ul></li></ul></div></div></nav><div data-ui-view></div>");
}]);
//# sourceMappingURL=influencerApp.js.map

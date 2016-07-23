(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
/**
 * Setup satellizer configuration
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
	.config(["$authProvider", function($authProvider) {
		$authProvider.baseUrl = process.env.API_URI;
		$authProvider.facebook({
			clientId: process.env.FACEBOOK_APP_ID
		});
	}]);

}).call(this,require('_process'))

},{"_process":12}],2:[function(require,module,exports){
/* jshint quotmark: true */
module.exports = {
  "particles": {
    "number": {
      "value": 50,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.41688713582503595,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 112.2388442605866,
      "color": "#ffffff",
      "opacity": 0.21646062821684559,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "top",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "repulse"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
};
/* jshint quotmark:single */

},{}],3:[function(require,module,exports){
'use strict';
angular.module('app.common')
    .directive('particles', ["$window", function($window) {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="particles" id="particles"></div>',
            link: function(scope, element, attrs, fn) {
              var opts = require('../config/particlesConfig.js');
              $window.particlesJS('particles', opts);
            }
        };
    }]);

},{"../config/particlesConfig.js":2}],4:[function(require,module,exports){
(function (process){
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
      var token = $storage.get('auth');
      if(!opts.headers) {
        opts.headers = {};
      }
      if(token) {
        opts.headers.Authorization = 'JWT ' + token;
      }
      if(opts.url.indexOf('http') !== 0) {
        opts.url = process.env.API_URI + opts.url;
      }
      opts.skipAuthorization = true;

      // endpoint
      $http(opts).then(function(result) {
        defer.resolve(result.data);
      }).catch(function(err) {
        defer.reject(err);
      });

      return defer.promise;
    };

    return service;
  }]);

}).call(this,require('_process'))

},{"_process":12}],5:[function(require,module,exports){
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

    service.has = function(key) {
      return !_.isNil(service.get(key));
    };

    service.get = function(key) {
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
    };

    service.put = function(key, object) {
      var obj = _.isPlainObject(object) ? CJSON.stringify(object) : object;
      $window.localStorage.setItem(uniqueKey + key, obj);
    };

    service.remove = function(key) {
      $window.localStorage.removeItem(uniqueKey + key);
    };

    return service;
  }]);

},{}],6:[function(require,module,exports){
(function (process){
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
        url: process.env.API_URI + url,
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

}).call(this,require('_process'))

},{"_process":12}],7:[function(require,module,exports){
/**
 * common components
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	'ui.router',
	'angularCSS',
	'satellizer',
  'ngFileUpload'
];

angular.module('app.common', components);


(function () {var f = require("./index.js");f["config"]=({"authConfig":require("./config/authConfig.js"),"particlesConfig":require("./config/particlesConfig.js")});f["directives"]=({"particlesDirective":require("./directives/particlesDirective.js")});f["helpers"]=({"api":require("./helpers/api.js"),"storage":require("./helpers/storage.js"),"uploader":require("./helpers/uploader.js")});f["index"]=require("./index.js");return f;})();

module.exports = 'app.common';

},{"./config/authConfig.js":1,"./config/particlesConfig.js":2,"./directives/particlesDirective.js":3,"./helpers/api.js":4,"./helpers/storage.js":5,"./helpers/uploader.js":6,"./index.js":7}],8:[function(require,module,exports){
/**
 * Influencer app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/inf')
];

angular.module('app', components)
  .run(["$state", function($state) {
  }]);

},{"./modules/inf":11}],9:[function(require,module,exports){
/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.inf')
	.controller('infAccountSigninController', ["$scope", function($scope) {
    $scope.formData = {};
    $scope.submit = function() {

    };
	}])
	.controller('infAccountSignupController', ["$scope", "$state", "$uploader", "fbProfile", function($scope, $state, $uploader, fbProfile) {
		$scope.formData = {
      facebookId: fbProfile.id,
      facebookToken: fbProfile.token,
      name: fbProfile.name,
      email: fbProfile.email
    };

    // pass forward info
    $scope.submit = function() {
      $state.go('.detail', {
        data: $scope.formData
      });
    };

    $scope.upload = function(file) {
      $uploader.upload('/file_demo', file)
        .then(function(data) {
          $scope.formData.picture = data.url;
        });
    };
	}])
  .controller('infAccountSignupDetailController', ["$scope", "$api", "$stateParams", function($scope, $api, $stateParams) {
    $scope.formData = $stateParams.data;
    $scope.message = '';

    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/register/influencer',
        data: $scope.formData
      }).then(function(data) {
        $scope.message = 'Please check your email';
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };
  }])
  .controller('infAccountConfirmController', ["$state", "$stateParams", "$api", "$storage", function($state, $stateParams, $api, $storage) {
    //confirm endpoint
    $api({
      method: 'POST',
      url: '/confirm',
      data: {
        token: $stateParams.q
      }
    }).then(function(data) {
      $storage.put('auth', data.token);
      $state.go('campaign'); //goto campaign list
    }).catch(function(err) {
      console.log(err);
    });
  }]);

},{}],10:[function(require,module,exports){
/**
 * Influencer Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.inf')
	.controller('infCampaignListController', ["$scope", function($scope) {

	}]);

},{}],11:[function(require,module,exports){
/**
 * influencer module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.inf', components)
	.config(["$stateProvider", function($stateProvider) {
		$stateProvider
			.state('index', {
				abstract: true,
				views: {
					'@': {
						templateUrl: 'layout.html'
					},
					'menu@index': {
						templateUrl: 'menu.html',
            resolve: {
              profile: ["$api", "$q", function($api, $q) {
                var deferred = $q.defer();
                $api({
                  url: '/me',
                  method: 'GET'
                }).then(deferred.resolve, function() {
                  deferred.resolve({});
                });
                return deferred.promise;
              }]
            },
            controller: ["$scope", "profile", function($scope, profile) {
              $scope.profile = profile;
            }]
					}
				}
			})
			//account
			.state('signin', {
				parent: 'index',
				url: '/signin',
				views: {
					'': {
						controller: 'infAccountSigninController',
						templateUrl: 'account/inf-account-signin.html'
					},
					'menu@index': {}
				}
			})
			.state('signup', {
				parent: 'index',
				url: '/signup',
        resolve: {
          fbProfile: ["$storage", function($storage) {
            var profile = $storage.get('fblogin');
            return profile;
          }]
        },
				views: {
					'': {
						controller: 'infAccountSignupController',
						templateUrl: 'account/inf-account-signup.html'
					},
					'menu@index': {}
				}
			})
        .state('signup.detail', {
          params: {
            data: null
          },
          views: {
            '@index': {
              controller: 'infAccountSignupDetailController',
              templateUrl: 'account/inf-account-signup-detail.html'
            },
            'menu@index': {}
          }
        })
      .state('confirm', {
        parent: 'index',
        url: '/confirm?q',
        views: {
          '@index': {
            controller: 'infAccountConfirmController'
          },
          'menu@index': {}
        }
      })
      .state('campaign', {
        parent: 'index',
        url: '/campaign',
        controller: 'infCampaignListController',
        templateUrl: 'campaign/inf-campaign-list.html'
      });
	}]);

(function () {var f = require("./index.js");f["account"]=({"infAccountController":require("./account/infAccountController.js")});f["campaign"]=({"infCampaignController":require("./campaign/infCampaignController.js")});f["index"]=require("./index.js");return f;})();

module.exports = 'app.inf';

},{"../../components/common":7,"./account/infAccountController.js":9,"./campaign/infCampaignController.js":10,"./index.js":11}],12:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[8])


angular.module("app.common").run(["$templateCache", function($templateCache) {
}]);angular.module("app.inf").run(["$templateCache", function($templateCache) {
$templateCache.put("menu.html", "<nav class=\"navbar navbar-default\"><div class=container-fluid><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=/#/inf>Project X</a></div><div id=navbar class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li class=active><a>Open Campaign</a></li><li><a href=#>My Campaign</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown><a href=# class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{profile.name}} (Influencer) <span class=caret></span></a><ul class=dropdown-menu><li><a href=#>Profile</a></li><li><a href=#>Payment</a></li><li><a href=#>Notification</a></li></ul></li></ul></div></div></nav>");
$templateCache.put("layout.html", "<div data-ui-view=menu></div><div data-ui-view></div>");
$templateCache.put("campaign/inf-campaign-list.html", "<div class=page-header><h2 class=pull-left>Open Campaign</h2><div class=clear></div></div><div class=\"panel panel-default\"><a href=brand-campaign-detail-open.html><div class=panel-body><div class=pull-left>Pokemon Campaign<br>Reward: 500-1000 Baht</div><div class=pull-right>10 Days Left<br>(10/10/2016)</div></div></a></div>");
$templateCache.put("account/inf-account-signup.html", "<div class=row><div class=col-md-6><form name=form class=form-horizontal novalidate><fieldset><div id=legend><legend>Influencer sign up</legend></div><div>{{message}}</div><div class=\"fileinput fileinput-new\" data-provides=fileinput><div class=\"fileinput-new thumbnail\" style=\"width: 120px; height: 120px;\"><img src={{formData.picture}} width=120></div><div class=\"fileinput-preview fileinput-exists thumbnail\" style=\"max-width: 200px; max-height: 150px;\"></div><div><span class=\"btn btn-default btn-file\"><span class=fileinput-new>Select image</span> <span class=fileinput-exists>Change</span> <input type=file name=slip data-ngf-select=upload($file)></span> <a href=# class=\"btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></div></div><div class=control-group><label class=control-label for=username>Name</label><div class=controls><input type=text id=username name=username class=form-control data-ng-model=formData.name></div></div><div class=control-group><label class=control-label for=contactnumber>Contact Number</label><div class=controls><input type=text id=contactnumber name=contactnumber class=form-control></div></div><br><div class=control-group><label class=control-label for=email>E-mail</label><div class=controls><input type=email id=email name=email class=form-control data-ng-model=formData.email></div></div><div class=control-group><label class=control-label for=email>Confirm E-mail</label><div class=controls><input type=email id=emailconfirm name=emailconfirm class=form-control></div></div><br></fieldset></form><div class=controls><a data-ng-click=submit()><button class=\"btn btn-success\">Continue</button></a></div></div></div>");
$templateCache.put("account/inf-account-signup-detail.html", "<div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div id=legend><legend>Influencer sign up detail</legend></div><div>{{message}}</div><div class=controls><label class=control-label>Sync with</label> <a href=brand-campaign-list.html><button class=\"btn btn-default disabled\">Facebook</button></a> <a href=brand-campaign-list.html><button class=\"btn btn-default\">Instagram</button></a> <a href=brand-campaign-list.html><button class=\"btn btn-default\">YouTube</button></a></div><div class=control-group><label class=control-label for=username>About Yourself</label><div class=controls><input type=text id=username name=username class=form-control></div></div><br><div class=control-group><label class=control-label for=email>Bank</label><div class=controls><input type=text class=form-control></div></div><div class=control-group><label class=control-label for=email>Bank Account Number</label><div class=controls><input type=text class=form-control></div></div><br></fieldset></form><div class=controls><a data-ng-click=submit()><button class=\"btn btn-success\">Sign Up</button></a></div></div></div>");
$templateCache.put("account/inf-account-signin.html", "<form class=form-signin><h2 class=form-signin-heading>Please sign in</h2><label for=inputEmail class=sr-only>Email address</label> <input type=email id=inputEmail class=form-control placeholder=\"Email address\" required autofocus> <label for=inputPassword class=sr-only>Password</label> <input type=password id=inputPassword class=form-control placeholder=Password required><div class=checkbox><label><input type=checkbox value=remember-me> Remember me</label></div><a data-ng-click=submit()><button class=\"btn btn-lg btn-primary btn-block\" type=submit>Sign in</button></a></form>");
}]);
//# sourceMappingURL=infApp.js.map

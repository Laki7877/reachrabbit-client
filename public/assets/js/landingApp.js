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

},{"_process":11}],2:[function(require,module,exports){
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

},{"_process":11}],5:[function(require,module,exports){
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

},{"_process":11}],7:[function(require,module,exports){
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
 * Landing app
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('./modules/landing')
];

angular.module('app', components)
  .run(["$state", function($state) {
  }]);

},{"./modules/landing":9}],9:[function(require,module,exports){
/**
 * landing module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.landing', components)
	.config(["$stateProvider", function($stateProvider) {
		$stateProvider
			.state('brand', {
				url: '/brand',
				controller: 'landingBrandController',
				templateUrl: 'landing-brand.html'
			})
			.state('inf', {
				url: '/inf',
				controller: 'landingInfController',
				templateUrl: 'landing-inf.html'
			});
	}]);

(function () {var f = require("./index.js");f["index"]=require("./index.js");f["landingController"]=require("./landingController.js");return f;})();

module.exports = 'app.landing';

},{"../../components/common":7,"./index.js":9,"./landingController.js":10}],10:[function(require,module,exports){
/**
 * Landing page controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.1
 */
'use strict';

angular.module('app.landing')
	.controller('landingBrandController', function() {

	})
	.controller('landingInfController', ["$scope", "$window", "$auth", "$storage", function($scope, $window, $auth, $storage) {
		$scope.loginWithFB = function() {
			$auth.authenticate('facebook')
				.then(function(res) {
          console.log(res.data);
          if(res.data.isLogin) {
            $storage.put('auth', res.data.token);
            $window.location.href= '/inf#/campaign';
          } else {
            $storage.put('fblogin', res.data);
            $window.location.href = '/inf#/signup';
				  }
        })
				.catch(function(err) {
          console.log(err);
        });
		};
	}]);

},{}],11:[function(require,module,exports){
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
}]);angular.module("app.landing").run(["$templateCache", function($templateCache) {
$templateCache.put("landing-inf.html", "<div class=\"alert alert-warning\" role=alert>This UI is only for POC. It won\'t be used after Sprint 0.</div><div class=jumbotron><h1>Project X for Influencer</h1><p class=lead>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet.</p><p><a class=\"btn btn-lg btn-primary\" role=button data-ng-click=loginWithFB()>Login with Facebook</a></p></div>");
$templateCache.put("landing-brand.html", "<div class=\"alert alert-warning\" role=alert>This UI is only for POC. It won\'t be used after Sprint 0.</div><div class=jumbotron><h1>Project X for Brand</h1><p class=lead>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet.</p><p><a class=\"btn btn-lg btn-success\" href=/brand#/signup role=button>Sign up Today</a> or <a href=/brand#/signin>Sign in</a></p></div>");
}]);
//# sourceMappingURL=landingApp.js.map

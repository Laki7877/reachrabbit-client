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
  .run(["$state", function($state) {
  }]);

},{"./modules/brand":11}],2:[function(require,module,exports){
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

},{"_process":14}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"../config/particlesConfig.js":3}],5:[function(require,module,exports){
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

},{"_process":14}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"_process":14}],8:[function(require,module,exports){
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

},{"./config/authConfig.js":2,"./config/particlesConfig.js":3,"./directives/particlesDirective.js":4,"./helpers/api.js":5,"./helpers/storage.js":6,"./helpers/uploader.js":7,"./index.js":8}],9:[function(require,module,exports){
/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
	.controller('brandAccountSignupController', ["$scope", "$state", "$api", function($scope, $state, $api) {
    $scope.formData = {};
    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/register/brand',
        data: $scope.formData
      }).then(function(data) {
        $scope.message = 'Please check your email';
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };
	}])
	.controller('brandAccountSigninController', ["$scope", "$state", "$storage", "$api", function($scope, $state, $storage, $api) {
    $scope.formData = {};
    $scope.submit = function() {
      $api({
        method: 'POST',
        url: '/login',
        data: $scope.formData
      }).then(function(data) {
        $storage.put('auth', data.token);
        $state.go('campaign.list');
      }).catch(function(err) {
        $scope.message = err.message;
      });
    };
	}])
  .controller('brandAccountConfirmController', ["$state", "$stateParams", "$api", "$storage", function($state, $stateParams, $api, $storage) {
    //confirm endpoint
    $api({
      method: 'POST',
      url: '/confirm',
      data: {
        token: $stateParams.q
      }
    }).then(function(data, s) {
      $storage.put('auth', data.token);
      $state.go('campaign.list'); //goto campaign list
    }).catch(function(err) {
      console.log(err);
    });
  }]);

},{}],10:[function(require,module,exports){
/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
	.controller('brandCampaignCreateController', 	["$scope", function($scope) {

	}])
	.controller('brandCampaignDetailController', 	["$scope", function($scope) {

	}])
	.controller('brandCampaignListController', 		["$scope", function($scope) {

	}])
	.controller('brandCampaignPaymentController', 	["$scope", function($scope) {

	}])
  .controller('brandCampaignCreateController',   ["$scope", function($scope) {

  }]);

},{}],11:[function(require,module,exports){
/**
 * brand module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
	require('../../components/common')
];

angular.module('app.brand', components)
	.config(["$stateProvider", function($stateProvider) {
		$stateProvider
			.state('index', { //root level state
				abstract: true,
				views: {
					'@': {
						templateUrl: 'layout.html'
					},
          'menu@index': {
            templateUrl: 'menu.html',
            controller: ["$scope", "$api", function($scope, $api) {
              $api({
                url: '/me',
                method: 'GET'
              }).then(function(profile) {
                $scope.profile = profile;
              });
            }]
          }
				}
			})
			// accounts
			.state('signin', {
				parent: 'index',
				url: '/signin',
				views: {
					'': {
						controller: 'brandAccountSigninController',
						templateUrl: 'account/brand-account-signin.html'
					},
					'menu@index': {}
				}
			})
			.state('signup', {
				parent: 'index',
				url: '/signup',
				views: {
					'': {
						controller: 'brandAccountSignupController',
						templateUrl: 'account/brand-account-signup.html'
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
              controller: 'brandAccountSignupDetailController',
              templateUrl: 'account/brand-account-signup-detail.html'
            },
            'menu@index': {}
          }
        })
      .state('confirm', {
        parent: 'index',
        url: '/confirm?q',
        views: {
          '@index': {
            controller: 'brandAccountConfirmController'
          },
          'menu@index': {}
        }
      })
			// submission
			.state('submission', {
				parent: 'index',
				url: '/submission/:id',
				templateUrl: 'submission/brand-submission-detail.html'
			})
			// proposal
			.state('proposal', {
				parent: 'index',
				url: '/proposal/:id',
				templateUrl: 'proposal/brand-proposal-detail.html'
			})
			// campaign
			.state('campaign', {
				parent: 'index',
				url: '/campaign',
				abstract: true,
				template: '<div data-ui-view></div>'
			})
				.state('campaign.proposal', {
					url: '/proposal/:id',
					controller: 'brandProposalController',
					templateUrl: 'proposal/brand-proposal-detail.html'
				})
				.state('campaign.submission', {
					url: '/payment/:id',
					controller: 'brandSubmissionController',
					templateUrl: 'submission/brand-submission-detail.html'
				})
				.state('campaign.list', {
					url: '',
					controller: 'brandCampaignListController',
					templateUrl: 'campaign/brand-campaign-list.html'
				})
        .state('campaign.create', {
          url: '/create',
          controller: 'brandCampaignCreateController',
          templateUrl: 'campaign/brand-campaign-create.html'
        })
				.state('campaign.detail', {
					url: '/:id',
					views: {
						'': {
							controller: 'brandCampaignDetailController',
							templateUrl: 'campaign/brand-campaign-detail.html'
						},
						'menu': {
							templateUrl: 'campaign/brand-campaign-detail-title.html'
						}
					}
				})
					.state('campaign.detail.draft', {
						controller: 'brandCampaignDetailController',
						templateUrl: 'campaign/brand-campaign-detail-draft.html'
					})
					.state('campaign.detail.open', {
						controller: 'brandCampaignDetailController',
						templateUrl: 'campaign/brand-campaign-detail-open.html'
					})
						.state('campaign.detail.open.payment', {
							url: '/payment',
							views: {
								'menu@campaign.detail': {},
								'@campaign-detail': {
									controller: 'brandCampaignPaymentController',
									templateUrl: 'campaign/brand-campaign-pay.html'
								}
							}
						})
					.state('campaign.detail.production', {
						controller: 'brandCampaignDetailController',
						templateUrl: 'campaign/brand-campaign-production.html'
					});
	}]);

(function () {var f = require("./index.js");f["account"]=({"brandAccountController":require("./account/brandAccountController.js")});f["campaign"]=({"brandCampaignController":require("./campaign/brandCampaignController.js")});f["index"]=require("./index.js");f["proposal"]=({"brandProposalController":require("./proposal/brandProposalController.js")});f["submission"]=({"brandSubmissionController":require("./submission/brandSubmissionController.js")});return f;})();

module.exports = 'app.brand';

},{"../../components/common":8,"./account/brandAccountController.js":9,"./campaign/brandCampaignController.js":10,"./index.js":11,"./proposal/brandProposalController.js":12,"./submission/brandSubmissionController.js":13}],12:[function(require,module,exports){
/**
 * Brand Proposal Controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
	.controller('brandProposalController', ["$scope", function($scope) {
		
	}]);

},{}],13:[function(require,module,exports){
/**
 * Brand submission controllers
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.brand')
	.controller('brandSubmissionController', ["$scope", function($scope) {

	}]);

},{}],14:[function(require,module,exports){
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

},{}]},{},[1])


angular.module("app.common").run(["$templateCache", function($templateCache) {
}]);angular.module("app.brand").run(["$templateCache", function($templateCache) {
$templateCache.put("submission/brand-submission-detail.html", "<div class=page-header><h2 class=pull-left>Submission Detail</h2><div class=pull-right><a href=brand-campaign-detail-production.html><button type=button name=button class=\"btn btn-default\">Back to Campaign Detail</button></a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body><h2>John Snow</h2>Facebook Follower: 1,250 | Instagram Follower: 15,250 | YouTube Follower: 15,250<br><br><img src=images/jon-snow.jpg class=img-responsive><br><p>Here is a screenshot from my video.</p><br><div class=pull-left><a href=brand-campaign-detail-production.html><button type=button name=button class=\"btn btn-primary\">Approve Submission</button></a> &nbsp <a href=brand-campaign-detail-production.html><button type=button name=button class=\"btn btn-default\">Ask for Revision</button></a></div><br><br></div></div>");
$templateCache.put("proposal/brand-proposal-detail.html", "<div class=page-header><h2 class=pull-left>Proposal Detail</h2><div class=pull-right><a href=brand-campaign-detail-open.html><button type=button name=button class=\"btn btn-default\">Back to Campaign Detail</button></a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body><h2>John Snow</h2>Facebook Follower: 1,250 | Instagram Follower: 15,250 | YouTube Follower: 15,250<br><br><div class=pull-left><a href=brand-campaign-detail-open.html><button type=button name=button class=\"btn btn-primary\">Select Proposal</button></a> &nbsp <a href=brand-campaign-detail-open.html><button type=button name=button class=\"btn btn-default\">Ask for Revision</button></a></div><br><br></div></div>");
$templateCache.put("menu.html", "<nav class=\"navbar navbar-default\"><div class=container-fluid><div class=navbar-header><button type=button class=\"navbar-toggle collapsed\" data-toggle=collapse data-target=#navbar aria-expanded=false aria-controls=navbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=/#/brand>Project X</a></div><div id=navbar class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><li class=active><a data-ui-sref=campaign.list>My Campaign</a></li><li><a href=#>Influencers</a></li></ul><ul class=\"nav navbar-nav navbar-right\"><li class=dropdown><a href=# class=dropdown-toggle data-toggle=dropdown role=button aria-haspopup=true aria-expanded=false>{{profile.name}} (Brand) <span class=caret></span></a><ul class=dropdown-menu><li><a href=#>Profile</a></li><li><a href=#>Payment</a></li><li><a href=#>Notification</a></li></ul></li></ul></div></div></nav>");
$templateCache.put("layout.html", "<div data-ui-view=menu></div><div data-ui-view></div>");
$templateCache.put("campaign/brand-campaign-pay.html", "<div class=page-header><h2 class=pull-left>Pay for Campaign</h2><div class=pull-right><a data-ui-sref=campaign.detail.open><button type=button name=button class=\"btn btn-default\">Back to Campaign Detail</button></a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body>Pokemon Campaign<div class=pull-right>Status: OPEN</div></div></div><div class=\"panel panel-default\"><div class=panel-body><div class=pull-left>Selected Proposal: 0<br>Current Budget: 0</div></div></div><div class=page-header><h3 class=pull-left>Confirm Payment</h3><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div class=control-group><label class=control-label for=brandname>Upload your slip</label><div class=\"fileinput fileinput-new input-group\" data-provides=fileinput><div class=form-control data-trigger=fileinput><i class=\"glyphicon glyphicon-file fileinput-exists\"></i> <span class=fileinput-filename></span></div><span class=\"input-group-addon btn btn-default btn-file\"><span class=fileinput-new>Select file</span><span class=fileinput-exists>Change</span><input type=file name=...></span> <a href=# class=\"input-group-addon btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></div></div></fieldset></form><br><div class=controls><a href=brand-campaign-list.html><button class=\"btn btn-success\">I have completed my payment</button></a></div></div></div></div></div>");
$templateCache.put("campaign/brand-campaign-list.html", "<div class=page-header><h2 class=pull-left>My Campaign</h2><div class=pull-right><a data-ui-sref=campaign.create><button type=button name=button class=\"btn btn-primary\">+ Create New Campaign</button></a></div><div class=clear></div></div><div class=\"panel panel-default\"><a data-ui-sref=campaign.detail.open><div class=panel-body>Pokemon Campaign<div class=pull-right>Status: OPEN</div></div></a></div><div class=\"panel panel-default\"><a data-ui-sref=campaign.detail.production><div class=panel-body>Pokemon Campaign<div class=pull-right>Status: PRODUCTION</div></div></a></div>");
$templateCache.put("campaign/brand-campaign-detail.html", "<div data-ui-view=menu></div><div data-ui-view></div>");
$templateCache.put("campaign/brand-campaign-detail-title.html", "<div class=page-header><h2 class=pull-left>Campaign Detail (OPEN)</h2><div class=pull-right><a data-ui-sref=campaign.list><button type=button name=button class=\"btn btn-default\">Back to Campaign List</button></a></div><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body>Pokemon Campaign<div class=pull-right>Status: OPEN</div></div></div>");
$templateCache.put("campaign/brand-campaign-detail-production.html", "<div class=\"panel panel-default\"><div class=panel-body><div class=pull-left>Selected Proposal: 2<br>Current Budget: 1900</div><div class=pull-right>Submission Deadline:<br>January 13, 2017</div></div></div><div class=page-header><h3 class=pull-left>Proposals</h3><div class=clear></div></div><div class=\"panel panel-default\"><a data-ui-sref=campaign.proposal><div class=panel-body><div class=pull-left>My Pikachu Video by John Snow<br>Status: Pending</div><div class=pull-right>Submission on:<br>January 10, 2017</div></div></a></div><div class=\"panel panel-default\"><a data-ui-sref=campaign.proposal><div class=panel-body><div class=pull-left>My Charamander Video by Jamie Lanister<br>Status: Pending</div><div class=pull-right>Submission on:<br>January 10, 2017</div></div></a></div>");
$templateCache.put("campaign/brand-campaign-detail-open.html", "<div class=\"panel panel-default\"><div class=panel-body><div class=pull-left>Selected Proposal: 0<br>Current Budget: 0</div><div class=pull-right><a data-ui-sref=.payment><button type=button name=button class=\"btn btn-primary\">Review & Pay</button></a></div></div></div><div class=page-header><h3 class=pull-left>Proposals</h3><div class=clear></div></div><div class=\"panel panel-default\"><a data-ui-sref=campaign.proposal><div class=panel-body>John Snow | Status: Pending<div class=pull-right>View Detail</div></div></a></div><div class=\"panel panel-default\"><a data-ui-sref=campaign.proposal><div class=panel-body>Jamie Lanister | Status: Pending<div class=pull-right>View Detail</div></div></a></div>");
$templateCache.put("campaign/brand-campaign-detail-draft.html", "<div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div class=control-group><label class=control-label for=brandname>Budget per Influencer</label><div class=controls><input type=text class=form-control></div></div><div class=control-group><label class=control-label for=brandname>Campaign Image</label><div class=\"fileinput fileinput-new input-group\" data-provides=fileinput><div class=form-control data-trigger=fileinput><i class=\"glyphicon glyphicon-file fileinput-exists\"></i> <span class=fileinput-filename></span></div><span class=\"input-group-addon btn btn-default btn-file\"><span class=fileinput-new>Select file</span><span class=fileinput-exists>Change</span><input type=file name=...></span> <a href=# class=\"input-group-addon btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></div></div><div class=control-group><label class=control-label for=brandname>Campaign Description</label><div class=controls><input type=text class=form-control></div></div><div class=control-group><label class=control-label for=brandname>Additional Image</label><div class=\"fileinput fileinput-new input-group\" data-provides=fileinput><div class=form-control data-trigger=fileinput><i class=\"glyphicon glyphicon-file fileinput-exists\"></i> <span class=fileinput-filename></span></div><span class=\"input-group-addon btn btn-default btn-file\"><span class=fileinput-new>Select file</span><span class=fileinput-exists>Change</span><input type=file name=...></span> <a href=# class=\"input-group-addon btn btn-default fileinput-exists\" data-dismiss=fileinput>Remove</a></div></div><br><div class=control-group><label class=control-label for=brandname>Proposal Deadline</label><div class=controls><input type=text class=form-control></div></div><div class=control-group><label class=control-label for=brandname>Submission Deadline</label><div class=controls><input type=text class=form-control></div></div></fieldset></form><br><br><div class=controls><a data-ui-sref=campaign.list><button class=\"btn btn-success\">Create Campaign</button></a></div></div></div></div></div>");
$templateCache.put("campaign/brand-campaign-create.html", "<div class=page-header><h2 class=pull-left>Create Campaign</h2><div class=clear></div></div><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div class=control-group><label class=control-label for=brandname>Campaign Name</label><div class=controls><input type=text class=form-control></div></div><div class=control-group><label class=control-label for=brandname>Campaign Category</label><div class=controls><input type=text class=form-control></div></div><div class=control-group><label class=control-label for=brandname>Media</label><div class=controls><input type=text class=form-control></div></div></fieldset></form><br><div class=controls><a data-ui-sref=campaign.detail.draft><button class=\"btn btn-success\">Create Campaign</button></a></div></div></div></div></div>");
$templateCache.put("account/brand-account-signup.html", "<div class=row><div class=col-md-6><form class=form-horizontal method=POST><fieldset><div id=legend><legend>Brand sign up</legend></div><div>{{message}}</div><div class=control-group><label class=control-label for=brandname>Brand Name</label><div class=controls><input type=text id=brandname name=brandname class=form-control data-ng-model=formData.brandName></div></div><div class=control-group><label class=control-label for=username>Name</label><div class=controls><input type=text id=username name=username class=form-control data-ng-model=formData.name></div></div><div class=control-group><label class=control-label for=contactnumber>Contact Number</label><div class=controls><input type=text id=contactnumber name=contactnumber class=form-control data-ng-model=formData.contactNumber></div></div><br><div class=control-group><label class=control-label for=email>E-mail</label><div class=controls><input type=email id=email name=email class=form-control data-ng-model=formData.email></div></div><div class=control-group><label class=control-label for=email>Confirm E-mail</label><div class=controls><input type=email id=emailconfirm name=emailconfirm class=form-control></div></div><br><div class=control-group><label class=control-label for=password>Password</label><div class=controls><input type=password id=password name=password class=form-control data-ng-model=formData.password></div></div><div class=control-group><label class=control-label for=password_confirm>Password (Confirm)</label><div class=controls><input type=password id=password_confirm name=password_confirm class=form-control></div></div><br></fieldset></form><div class=controls><a data-ng-click=submit()><button class=\"btn btn-success\">Sign Up</button></a></div></div></div>");
$templateCache.put("account/brand-account-signin.html", "<form class=form-signin><h2 class=form-signin-heading>Please sign in</h2><label for=inputEmail class=sr-only>Email address</label> <input type=email id=inputEmail class=form-control placeholder=\"Email address\" required autofocus data-ng-model=formData.email> <label for=inputPassword class=sr-only>Password</label> <input type=password id=inputPassword class=form-control placeholder=Password required data-ng-model=formData.password><div class=checkbox><label><input type=checkbox value=remember-me> Remember me</label></div><a data-ng-click=submit()><button class=\"btn btn-lg btn-primary btn-block\" type=submit>Sign in</button></a></form>");
}]);
//# sourceMappingURL=brandApp.js.map

/**
 * Service
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

angular.module('myApp.service', ['satellizer'])
    .constant('Config', {
        API_BASE_URI: 'http://bella.reachrabbit.co:8080',
        FACEBOOK_APP_ID: "1648733485452450",
        INSTAGRAM_APP_ID: "c428876109c44daa9a54cf568e96e483",
        YOUTUBE_APP_ID: "486841241364-75hb5e24afp7msiitf8t36skfo3mr0h7.apps.googleusercontent.com"
    })
    .run(['Config', '$window', '$location', function (Config, $window, $location) {
        if ($window.sessionStorage.API_OVERRIDE) {
            Config.API_BASE_URI = $window.sessionStorage.API_OVERRIDE;
        }

    }])
    .factory('validator', [function() {
      return {
        formValidate: function(form) {
          if(form.$invalid && form.$error.required && form.$error.required.length > 0) {
            return {
              message: 'กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน'
            };
          } else if(form.$invalid) {
            return {
              message: 'กรุณากรอกข้อมูลให้ถูกต้อง'
            };
          }
          return; //nothing
        }
      };
    }])
    .factory('util', ['$window', function ($window) {
        return {
            warnOnExit: function (scope, fn) {
                fn = fn || function() {
                    return (scope.form || {}).$dirty;
                };

                scope.$on('$stateChangeStart', function(e) {
                    if(fn()) {
                        if(!$window.confirm('Changes you made may not be saved.')) {
                            e.preventDefault();
                        }
                    }
                });
                $window.onbeforeunload = function () {
                    //Make it prompt on fn return true
                    if (!fn()) {
                        return null;
                    }

                    var message = "",
                        e = e || $window.event;
                    // For IE and Firefox
                    if (e) {
                        e.returnValue = message;
                    }

                    // For Safari
                    return message;
                };
            }
        };
    }])
    .factory('baseUrlInjector', ['Config', '$window', function (Config, $window) {
        var inj = {
            request: function (cc) {
                if (cc.url[0] === "/") {
                    cc.url = Config.API_BASE_URI + cc.url;
                    cc.headers['X-Auth-Token'] = $window.localStorage.token;
                    //Prevent satellizer's evil hack
                    cc.skipAuthorization = true;
                }
                return cc;
            }
        };
        return inj;
    }])
    .factory('authStatusCheckInjector', ['$q', '$rootScope', function ($q, $rootScope) {
        var service = this;
        service.responseError = function (response) {
            if (response.status == 401) {
                $rootScope.signOut('401');
            }

            if (!response.data) {
                response.data = { message: "External error" };
            }

            return $q.reject(response);
        };
        return service;
    }])
    .config(['$authProvider', 'Config', '$httpProvider', function ($authProvider, Config, $httpProvider) {
        $authProvider.baseUrl = Config.API_BASE_URI;
        //Google account
        $authProvider.google({
            clientId: Config.YOUTUBE_APP_ID,
            scope: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/userinfo.email']
        });

        //Facebook account
        $authProvider.facebook({
            clientId: Config.FACEBOOK_APP_ID,
            scope: ['pages_show_list', 'manage_pages']
        });

        $authProvider.instagram({
            clientId: Config.INSTAGRAM_APP_ID,
            scope: ['likes', 'public_content', 'basic']
        });
        //Due to wrongness in satellizer hijacking our options request
        //We are forced to deceive it into believing that our header is acceptable
        $authProvider.tokenHeader = 'X-Auth-Token';
        $authProvider.withCredentials = false;
        $authProvider.tokenType = 'Ignore';

        //Intercept all $http request and add appropriate stuff
        $httpProvider.interceptors.push('baseUrlInjector');
        $httpProvider.interceptors.push('authStatusCheckInjector');
        $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json' };
        $httpProvider.defaults.headers.put = { 'Content-Type': 'application/json' };

    }])
    .factory('AccountService', ['$http', '$q', function ($http, $q) {
        return {
            getUser: function (id) {
                return $http({
                    url: '/users/' + id
                });
            },
            /*
             * Get Profile
             */
            getProfile: function (id) {
                var path = '/profile/';
                if (id) path = path + id;
                return $q(function (resolve, reject) {
                    $http.get(path).then(function (response) {
                        if (_.has(response.data, 'influencer.birthday')) {
                            response.data.influencer.birthday = new Date(response.data.influencer.birthday);
                        }

                        //TOOD: QUick fix until DB team go one way
                        var x = Object.keys(response.data);
                        response.data.user = {};
                        x.forEach(function (key) {
                            //out in
                            response.data.user[key] = response.data[key];
                            if (response.data.influencer) {
                                //in to out
                                var infl = Object.keys(response.data.influencer);
                                infl.forEach(function (infKey) {
                                    response.data[infKey] = response.data.influencer[infKey];
                                });
                            }
                            if (response.data.brand) {
                                //in to out
                                var brad = Object.keys(response.data.brand);
                                brad.forEach(function (infKey) {
                                    response.data[infKey] = response.data.brand[infKey];
                                });
                            }
                        });

                        resolve(response);
                    })
                        .catch(function (err) {
                            reject(err);
                        });
                });
            },
            saveProfile: function (profile) {
                return $http.put("/profile", profile);
            },
            /*
             * get token
             * return {"token": <token>}
             */
            getToken: function (username, password) {
                return $http.post("/auth/login", {
                    email: username,
                    password: password
                });
            },
            getTokenInfluencer: function (username, password) {
                return $http.post("/auth/influencer", {
                    email: username,
                    password: password
                });
            }
        };
    }])
    .factory('InfluencerAccountService', ['$http', function ($http) {
        return {
            /*
             * returns influencer user schema
             */
            signup: function (influencer) {
                return $http.post("/signup/influencer", influencer);
            },
        };
    }])
    .factory('BrandAccountService', ['$http', function ($http) {
        return {
            /*
             * returns brand user schema
             */
            signup: function (brand) {
                return $http.post("/signup/brand", brand);
            },

        };
    }])
    .factory('CampaignService', ['$http', '$q', function ($http, $q) {
        var deserializeCampaign = function (campaign) {
            campaign.campaignResources = campaign.campaignResources.map(function (campaignResource) {
                return campaignResource.resource;
            });
            if (campaign.proposalDeadline) {
                campaign.proposalDeadline = new Date(campaign.proposalDeadline);
            }
            return campaign;
        };

        var serializeCampaign = function (campaign) {
            campaign.campaignResources = campaign.campaignResources.map(function (resource, index) {
                return {
                    position: index,
                    resource: resource
                };
            });

            return campaign;
        };

        return {
            serializeCampaign: serializeCampaign,
            deserializeCampaign: deserializeCampaign,
            getActiveCampaigns: function () {
                return $http({
                    url: '/campaigns/active',
                    method: 'GET'
                });
            },
            getOpenCampaigns: function (params) {
                var opt = {
                    url: "/campaigns/open",
                    params: params
                };
                return $q(function (resolve, reject) {
                    $http(opt)
                        .then(function (response) {
                            var rr = response.data.content.map(function (campaign) {
                                campaign.resources = campaign.campaignResources.map(function (campaignResource) {
                                    return campaignResource.resource;
                                });
                                delete campaign.campaignResources;
                                return campaign;
                            });
                            response.data.content = rr;

                            resolve(response);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                });
            },
            getAll: function (params) {
                //TODO: make universal getter
                return $q(function (resolve, reject) {
                    $http({
                        url: "/campaigns",
                        method: 'GET',
                        params: params
                    })
                        .then(function (response) {
                            var rr = response.data.content.map(function (campaign) {
                                return deserializeCampaign(campaign);
                            });
                            response.data.content = rr;
                            resolve(response);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                });
            },
            getOne: function (id) {
                return $q(function (resolve, reject) {
                    $http.get("/campaigns/" + id)
                        .then(function (response) {
                            response.data = deserializeCampaign(response.data);
                            resolve(response);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                });
            },
            sendProposal: function (proposal, campaignId) {
                return $http({
                    url: "/campaigns/" + campaignId + "/proposals",
                    method: "POST",
                    data: proposal
                });
            },
            save: function (campaign) {
                var putOrPost = 'POST';
                if (campaign.campaignId) {
                    putOrPost = 'PUT';
                }
                campaign = serializeCampaign(campaign);
                return $q(function (resolve, reject) {
                    $http({
                        url: "/campaigns/" + (putOrPost.toUpperCase() == 'PUT' ? campaign.campaignId : ''),
                        method: putOrPost,
                        data: campaign
                    })
                        .then(function (response) {
                            response.data = deserializeCampaign(response.data);
                            resolve(response);
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                });
            },
            getAppliedProposal: function(campaignId){
                return $http.get('/campaigns/' + campaignId + '/applied');
            }
        };
    }])
    .factory('ProposalService', ['$http', function ($http) {
        return {
            getOne: function (proposalId) {
                return $http({
                    url: '/proposals/' + proposalId,
                    method: 'get'
                });
            },
            getAll: function (params) {
                return $http({
                    url: '/proposals',
                    method: 'GET',
                    params: params
                });
            },
            update: function (proposal, campaignId) {
                return $http({
                    url: "/proposals/" + proposal.proposalId,
                    method: "PUT",
                    data: proposal
                });
            },
            updateStatus:  function(proposalId, newStatus){
                 return $http({
                    url: "/proposals/" + proposalId + "/status/" + newStatus,
                    method: "PUT"
                });
            },
            count: function (params) {
                return $http({
                    url: '/proposals/count',
                    method: 'GET',
                    params: params
                });
            },
            getActive: function () {
                return $http({
                    url: '/proposals/active',
                    method: 'GET'
                });
            },
            getMessages: function (proposalId, params) {
                return $http({
                    url: '/proposals/' + proposalId + '/proposalmessages',
                    method: 'get',
                    params: params
                });
            },
            countInbox: function (params) {
                return $http({
                    url: '/proposals/count/poll',
                    method: 'get',
                    params: params,
                    ignoreLoadingBar: true
                });
            },
            countUnreadMessages: function (proposalId, params) {
                return $http({
                    url: '/proposals/' + proposalId + '/proposalmessages/count',
                    method: 'get',
                    params: params
                });
            },
            getMessagesPoll: function (proposalId, params) {
                return $http({
                    url: '/proposals/' + proposalId + '/proposalmessages/poll',
                    method: 'get',
                    params: params,
                    ignoreLoadingBar: true
                });
            },
            sendMessage: function (proposalMessage) {
                return $http({
                    url: '/proposals/' + proposalMessage.proposal.proposalId + '/proposalmessages',
                    method: 'post',
                    data: proposalMessage
                });
            }
        };
    }])
    .factory('DataService', ['$http', '$q', function ($http, $q) {
        return {
            getMedium: function () {
                return $http.get("/data/media");

            },
            getBanks: function () {
                return $http.get("/data/banks");
            },
            getCategories: function () {
                return $http.get("/data/categories");
            },
            getCompletionTime: function () {
                return $http.get("/data/completiontime");
            },
            getBudgets: function(){
                return $http.get("/data/budgets");
            }
        };
    }])
    .factory('ResourceService', ['$http', function ($http) {
        return {
            uploadWithUrl: function (url) {
                return $http({
                    url: "/resources/remote",
                    method: "POST",
                    data: {
                        url: url
                    }
                });
            }
        };
    }])
    .factory('$uploader', ['Upload', 'UploadValidate', '$q', 'Config', '$window', '$timeout', function (Upload, UploadValidate, $q, Config, $window, $timeout) {
        var service = {};

        service.validate = function(file, length, ngModel, attr, scope) {
          var deferred = $q.defer();
          ngModel.$setPristine();
          UploadValidate.validate(file, length, ngModel, attr, scope)
              .then(function(data) {
                  var ok = true;
                  _.forEach(ngModel.$ngfValidations, function(v) {
                   // console.log(ngModel.$ngfValidations);
                      if(_.has(attr, 'ngf' + _.upperFirst(v.name))) {
                          ngModel.$setValidity(v.name, v.valid);
                      }
                      ok = ok && v.valid;
                  });
                  ngModel.$setDirty();
                  deferred.resolve(ok);
                  return ok;
              });


          return deferred.promise;
        };

        service.upload = function (url, data, evtHandler, opts) {
            var deferred = $q.defer();
            var options = _.extend({
                url: Config.API_BASE_URI + url,
                data: data,
                headers: { 'X-Auth-Token': $window.localStorage.token },
            }, opts);

            // upload on url
            Upload.upload(options).then(function (data) {
                deferred.resolve(data.data);
            }, deferred.reject, evtHandler);

            return deferred.promise;
        };

        return service;
    }])
    .factory('CtrlHelper', ['$location', '$anchorScroll', '$rootScope', function ($location, $anchorScroll, $rootScope) {
        return {
            'setState': function setState(newState) {
                $rootScope.state = newState;
                $location.hash('navbar');
                $anchorScroll();
            }
        };
    }])
    .factory('UserProfile', ['$rootScope', '$window', function ($rootScope, $window) {
        return {
            get: function () {
                if (!$window.localStorage.profile) {
                    return null;
                }
                return JSON.parse($window.localStorage.profile);
            },
            set: function (profile) {
                $window.localStorage.profile = JSON.stringify(profile);
            }
        };
    }]);

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
.run(['Config', '$window', function(Config, $window){
    if($window.sessionStorage.API_OVERRIDE){
        Config.API_BASE_URI = $window.sessionStorage.API_OVERRIDE;
    }
}])
.factory('baseUrlInjector', ['Config', '$window', function(Config, $window){
    var inj = {
        request: function(cc) {
            if(cc.url[0] === "/"){
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
.factory('authStatusCheckInjector', ['$q', '$rootScope', function($q, $rootScope){
    var service = this;
    service.responseError = function(response) {
        if (response.status == 401){
            $rootScope.signOut('401');
        }

        if(!response.data){
            response.data = { message: "External error"};
        }

        return $q.reject(response);
    };
    return service;
}])
.config(['$authProvider', 'Config', '$httpProvider', function($authProvider, Config, $httpProvider){
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
  $httpProvider.defaults.headers.post = {'Content-Type': 'application/json'};
  $httpProvider.defaults.headers.put =  {'Content-Type': 'application/json'};

}])
.factory('AccountService', ['$http', function($http){
    return {
        getUser: function(id){
            return $http({
                url: '/users/' + id
            });
        },
        /*
        * Get Profile
        */
        getProfile: function(){
            return $http({
                url: "/profile"
            });
        },
        saveProfile: function(profile){
            return $http.put("/profile", profile);
        },
        /*
        * get token
        * return {"token": <token>}
        */
        getToken: function(username, password){
            return $http.post("/auth/login", {
                    email: username,
                    password: password
            });
        }
    };
}])
.factory('InfluencerAccountService', ['$http', function($http){
    return {
        /*
        * returns influencer user schema
        */
        signup: function(influencer){
            return $http.post("/signup/influencer", influencer);
        },
    };
}])
.factory('BrandAccountService', ['$http', function($http) {
    return {
        /*
        * returns brand user schema
        */
        signup: function(brand){
            return $http.post("/signup/brand", brand);
        },

    };
}])
.factory('CampaignService', ['$http', function($http) {
    return {
        getOpenCampaigns: function(filter){
            var opt = {
                skipAuthorization: true,
                url: "/campaigns/open"
            };
            if(filter instanceof Object){
                if(filter.mediaId){
                    opt.params.mediaId = filter.mediaId;
                }
            }
            return $http(opt);
        },
        getAll: function(params){
            return $http({
              url: "/campaigns",
              method: 'GET',
              params: params
            });
        },
        getOne: function(id){
            return $http.get("/campaigns/" + id);
        },
        sendProposal: function(proposal, campaignId){
            return $http({
                url: "/campaigns/" + campaignId + "/proposals",
                method: "POST",
                data: proposal
            });
        },
        save: function(campaign){
            var putOrPost = 'POST';
            if(campaign.campaignId){
                putOrPost = 'PUT';
            }
            return $http({
                url: "/campaigns/" + (putOrPost.toUpperCase() == 'PUT' ? campaign.campaignId : ''),
                method: putOrPost,
                data: campaign
            });
        }
    };
}])
.factory('ProposalService', ['$http', function($http){
    return {
        getOne: function(proposalId){
            return $http({
                url: '/proposals/' + proposalId,
                method: 'get'
            });
        },
        getAll: function(params) {
            return $http({
              url: '/proposals',
              method: 'GET',
              params: params
            });
        }
    };
}])
.factory('DataService', ['$http', function($http) {
    return {
        getMedium: function(){
            return $http.get("/data/media");
        },
        getBanks: function(){
            return $http.get("/data/banks");
        },
        getCategories: function(){
            return $http.get("/data/categories");
        },
        getCompletionTime: function(){
            return $http.get("/data/completiontime");
        }
    };
}])
.factory('ResourceService', ['$http', function($http) {
    return {
        uploadWithUrl: function(url){
            return $http({
                url: "/resources/remote",
                method: "POST",
                data: {
                    url : url
                }
            });
        }
    };
}])
.factory('$uploader', ['Upload', '$q', 'Config','$window', function(Upload, $q, Config, $window) {
    var service = {};

    service.upload = function(url, data, evtHandler, opts) {
      var deferred = $q.defer();
      var options = _.extend({
        url: Config.API_BASE_URI + url,
        data: data,
        headers: {'X-Auth-Token': $window.localStorage.token},
      }, opts);

      // upload on url
      Upload.upload(options).then(function(data) {
        deferred.resolve(data.data);
      }, deferred.reject, evtHandler);

      return deferred.promise;
    };

    return service;
  }])
  .factory('CtrlHelper', ['$location', '$anchorScroll', '$rootScope', function($location, $anchorScroll, $rootScope){
      return {
          'setState': function setState(newState){
            $rootScope.state = newState;
            $location.hash('navbar');
            $anchorScroll();
        }
      };
  }])
  .factory('UserProfile', ['$rootScope', '$window', function($rootScope, $window){
      return {
          get: function(){
              if(!$window.localStorage.profile){
                  return null;
              }
              return JSON.parse($window.localStorage.profile);
          },
          set: function(profile){
              $window.localStorage.profile = JSON.stringify(profile);
          }
      };
  }]);

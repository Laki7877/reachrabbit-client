/**
 * Service
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com>
 * @since      0.0.1
 */
/* jshint node: true */
'use strict';

angular.module('myApp.service', [])
.value('config', {
  'apiBaseUri': 'http://bella.reachrabbit.co:8080'
})
.factory('baseUrlInjector', ['config', '$window', function(config, $window){
    var inj = {
        request: function(cc) {
            if(cc.url[0] === "/"){
                cc.url = config.apiBaseUri + cc.url;
                cc.headers['X-Auth-Token'] = $window.localStorage.token;
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
        return $q.reject(response);
    };
    return service;
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('baseUrlInjector');
  $httpProvider.interceptors.push('authStatusCheckInjector');

}])
.factory('AccountService', ['$http', function($http){
    return {
        /*
        * Get Profile
        */
        getProfile: function(){
            return $http.get("/profile");
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
            var opt = {};
            if(filter instanceof Object){
                opt = {
                    params: filter
                };
            }
            return $http.get("/campaigns/open", opt);
        },
        getAll: function(){
            return $http.get("/campaigns");
        },
        getOne: function(id){
            return $http.get("/campaigns/" + id);
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
        }
    };
}])
.factory('$uploader', ['Upload', '$q', 'config','$window', function(Upload, $q, config, $window) {
    var service = {};

    service.upload = function(url, data, evtHandler, opts) {
      var deferred = $q.defer();
      var options = _.extend({
        url: config.apiBaseUri + url,
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
  
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
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('baseUrlInjector');
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
            return $http.post("/profile", profile);
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
                url: "/campaigns/" + campaign.campaignId,
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
  }]);

'use strict';

angular.module('myApp.service', [])
.value('config', {
  'apiBaseUri': 'http://bella.reachrabbit.co'
})
.factory('baseUrlInjector', ['config', '$window', function(config, $window){
    var inj = {
        request: function(cc) {
            if(cc.url[0] === "/"){
                cc.url = config.apiBaseUri + cc.url;
                cc.headers['X-Auth'] = $window.localStorage['token'];
            }
            return cc;
        }
    };
    return inj;
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('baseUrlInjector');
}])
.factory('BrandAccountService', ['$http', function($http) {
    return {
        /*
        * returns brand user schema
        */
        signup: function(brand){
            return $http.post("/signup/brand", brand);
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
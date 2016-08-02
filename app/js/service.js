'use strict';

angular.module('myApp.service', [])
.value('config', {
  'apiBaseUri': 'http://bella.reachrabbit.co'
})
.factory('baseUrlInjector', ['config', function(config){
    var inj = {
        request: function(cc) {
            if(cc.url[0] === "/"){
                cc.url = config.apiBaseUri + cc.url;
            }
            return cc;
        }
    };
    return inj;
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('baseUrlInjector')
}])
.factory('SignUpService', ['$http', function($http) {
    return {
        signupBrand: function(brand){
            return $http.post("/signup/brand", brand);
        }
    };
}])
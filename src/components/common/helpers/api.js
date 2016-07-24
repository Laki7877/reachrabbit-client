/**
 * API service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.3
 */
'use strict';

angular.module('app.common')
  .factory('$api', function($http, $storage, $q, $state) {
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
        opts.url = process.env.API_URI + opts.url;
      }
      opts.skipAuthorization = true;

      // endpoint
      $http(opts).then(function(result) {
        defer.resolve(result.data);
      }).catch(function(err) {
        console.log("Error", err);
        if(err.status == 401){
          $state.go('error', {code: 401, description: err });
        }
        defer.reject(err);
      });

      return defer.promise;
    };

    return service;
  })
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

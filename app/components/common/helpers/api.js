/**
 * API service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$api', function($http, $storage, $q) {
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

      console.log(opts);
      // endpoint
      $http(opts).then(function(result) {
        defer.resolve(result.data);
      }).catch(function(err) {
        defer.reject(err);
      });

      return defer.promise;
    };

    return service;
  });

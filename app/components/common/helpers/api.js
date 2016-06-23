/**
 * API service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$api', function($http, $storage) {
    var service = function(opts) {
      var token = $storage.get('auth');

      if(!opts.headers) {
        opts.headers = {};
      }
      if(!_.isNil(token)) {
        opts.headers.Authorization = 'JWT ' + token;
      }
      if(opts.url.indexOf('http') !== 0) {
        opts.url = process.env.API_URI + opts.url;
      }
      return $http(opts);
    };

    return service;
  });

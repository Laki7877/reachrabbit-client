/**
 * Local storage service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$storage', function($window) {
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
  });

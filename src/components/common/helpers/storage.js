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

    return {
      has: function(key) {
        return !_.isNil(this.get(key));
      },
      get: function(key) {
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
      },
      put: function(key, object) {
        var obj = _.isPlainObject(object) ? CJSON.stringify(object) : object;
        $window.localStorage.setItem(uniqueKey + key, obj);
      },
      remove: function(key) {
        $window.localStorage.removeItem(uniqueKey + key);
      },
      putAuth: function(token) {
        this.put('auth', token);
      },
      getAuth: function() {
        return this.get('auth');
      },
      removeAuth: function() {
        this.remove('auth');
      }
    };
  });

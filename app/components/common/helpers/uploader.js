/**
 * File uploader service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$uploader', function(Upload, $q) {
    var service = {};

    service.upload = function(url, file, data, opts) {
      var deferred = $q.defer();

      // upload on url
      Upload.upload(_.extend({
        url: process.env.API_URI + url,
        data: _.extend({}, data, { file: file }),
        skipAuthorization: true
      }, opts)).then(function(data) {
        deferred.resolve(data.data);
      }, deferred.reject);

      return deferred.promise;
    };

    return service
  });

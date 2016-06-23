/**
 * File uploader service
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
  .factory('$uploader', function() {
    var service = {};

    service.upload = function(url, file, data, opts) {
      return Upload.upload(_.extend({
        url: process.env.API_URI + url,
        data: _.extend({}, data, { file: file }),
      }, opts));
    };
  });

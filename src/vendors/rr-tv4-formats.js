/**
 * Custom tv4-format for rr application
 */
'use strict';

module.exports = {
  number: function(data, schema) {
    if(typeof data === 'string' && !/^[0-9]+$/.test(data)) {
      return null;
    }
    return 'must be number';
  }
};

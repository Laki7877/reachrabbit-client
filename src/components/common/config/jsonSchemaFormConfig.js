/**
 * Json-schema-form configuration
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.3
 */
'use strict';

// tv4Code error codes
var tv4Code = {
  INVALID_TYPE: 0,
  ENUM_MISMATCH: 1,
  ANY_OF_MISSING: 10,
  ONE_OF_MISSING: 11,
  ONE_OF_MULTIPLE: 12,
  NOT_PASSED: 13,
  // Numeric errors
  NUMBER_MULTIPLE_OF: 100,
  NUMBER_MINIMUM: 101,
  NUMBER_MINIMUM_EXCLUSIVE: 102,
  NUMBER_MAXIMUM: 103,
  NUMBER_MAXIMUM_EXCLUSIVE: 104,
  NUMBER_NOT_A_NUMBER: 105,
  // String errors
  STRING_LENGTH_SHORT: 200,
  STRING_LENGTH_LONG: 201,
  STRING_PATTERN: 202,
  // Object errors
  OBJECT_PROPERTIES_MINIMUM: 300,
  OBJECT_PROPERTIES_MAXIMUM: 301,
  OBJECT_REQUIRED: 302,
  OBJECT_ADDITIONAL_PROPERTIES: 303,
  OBJECT_DEPENDENCY_KEY: 304,
  // Array errors
  ARRAY_LENGTH_SHORT: 400,
  ARRAY_LENGTH_LONG: 401,
  ARRAY_UNIQUE: 402,
  ARRAY_ADDITIONAL_ITEMS: 403,
  // Custom/user-defined errors
  FORMAT_CUSTOM: 500,
  KEYWORD_CUSTOM: 501,
  // Schema structure
  CIRCULAR_REFERENCE: 600,
  // Non-standard validation options
  UNKNOWN_PROPERTY: 1000
};

angular.module('app.common')
  .config(function(sfErrorMessageProvider) {
    //set default error messages
    sfErrorMessageProvider.setDefaultMessage(tv4Code.OBJECT_REQUIRED, 'This is required field');
    sfErrorMessageProvider.setDefaultMessage(tv4Code.FORMAT_CUSTOM, 'Please enter a valid {{schema.format}}');
  });

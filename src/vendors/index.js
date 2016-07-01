'use strict';

global.angular = require('angular');
global._ = require('lodash');
global.CJSON = require('circular-json');

require('es5-shim');
require('es5-sham');
require('jquery');

require('particles.js');
require('satellizer');
require('ng-file-upload');

require('angular-material');
require('angular-css');
require('angular-sanitize');
require('angular-strap');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-schema-form');
require('angular-schema-form-bootstrap');
require('./angular-schema-form-datetimepicker');

require('tv4').addFormat(require('tv4-formats'));
require('tv4').addFormat(require('./rr-tv4-formats'));
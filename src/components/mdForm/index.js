'use strict';

angular.module('mdForm', ['ngMaterial', 'ngMessages'])
  .provider('mdForm', function() {
    this.defaultOptions = {
      ngModelOptions: {
        updateOn: 'blur'
      },
      $error: {
        required: 'This is required',
        email: 'Please enter a valid email'
      }
    };
    this.setDefaultMdFormOptions = function(options) {
      this.defaultOptions = options;
    };
    this.$get = function() {
      return this;
    };
  })
	.directive('mdForm', function(mdForm) {
		return {
			restrict: 'A',
			require: 'form',
			link: function(scope, elem, attrs, form) {
        scope.formOptions = {};
        attrs.$observe('mdFormOptions', function(value) {
          scope.$watch(value, function(newValue) {
            scope.formOptions = newValue || {};
          }, true);
        });

        scope.getForm = function() {
					return form;
				};

        // set ng model options
        _.forOwn(form, function(v, k) {
          if(!_.startsWith(k, '$') && mdForm.defaultOptions['ngModelOptions']) {
            v.$$setOptions(mdForm.defaultOptions['ngModelOptions']);
          }
        });
			},
			controller: function($scope) {
				this.getModel = function(name) {
					return $scope.getForm()[name];
				};
				this.getMessages = function(name, type) {
					return $scope.formOptions[name] ? ($scope.formOptions[name][type] || mdForm.defaultOptions[type]) : mdForm.defaultOptions[type];
				}
			}
		}
	})
	.directive('mdMessages', function() {
		return {
			restrict: 'A',
			require: '^^mdForm',
      scope: true,
			templateUrl: 'md-messages.html',
			link: function(scope, elem, attrs, form) {
        scope.name = attrs.mdMessages;
				scope.getModel = function() {
					return form.getModel(scope.name);
				};
				scope.getMessages = function(type) {
					return form.getMessages(scope.name, type);
				};
        scope.hasError = function() {
          return !_.isEmpty(scope.getModel().$error);
        };
			}
		};
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'mdForm';

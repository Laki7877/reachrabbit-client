'use strict';

angular.module('mdForm', ['ngMaterial', 'ngMessages'])
	.directive('mdForm', function() {
		return {
			restrict: 'A',
			require: 'form',
			scope: {
				mdForm: '='
			},
			link: function(scope, elem, attrs, form) {
				scope.getForm = function() {
					return form;
				};
			},
			controller: function($scope) {
				this.getModel = function(name) {
					return $scope.getForm()[name];
				};
				this.getMessages = function(name, type) {
					return $scope.mdForm[name] ? $scope.mdForm[name][type] : undefined;
				}
			}
		}
	})
	.directive('mdError', function() {
		return {
			restrict: 'A',
			require: '^^mdForm',
			templateUrl: 'md-errors.html',
			link: function(scope, elem, attrs, form) {
				scope.getModel = function() {
					return form.getModel(attrs.rrError);
				};
				scope.getMessages = function() {
					return form.getMessages(attrs.rrError, 'error');
				};
			}
		};
	})
	.directive('mdHint', function() {
		return {
			restrict: 'A',
			require: '^^mdForm',
			templateUrl: 'md-hints.html',
			link: function(scope, elem, attrs, form) {
				scope.getMessages = function() {
					return form.getMessages(attrs.mdForm, 'hint');
				};
			}
		};
	});

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'mdForm';
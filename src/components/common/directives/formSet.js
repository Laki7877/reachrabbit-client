/**
 * Set of form fields with functionalities
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
    /*
    * Checkbox list of interested topics
    */
    .directive('fsInterestsSelector', function ($uploader, $api) {
        return {
            restrict: 'AE',
            scope: {
              model: '=ngModel' //selected object
            },
            templateUrl: 'templates/fs-interests-selector.html',
            link: function (scope, elem, attrs, form) {

                scope.topics = [];
                //get cat list
                $api({
                  method: 'GET',
                  url: '/data/categories'
                }).then(function(data) {
                  scope.topics = data;
                }).catch(function(err) {
                  console.error("fsInterestsSelector", err);
                });

                scope.topicExists = function(item) {
                  return scope.model.indexOf(item.categoryId) !== -1;
                }
                scope.topicDisabled = function(item) {
                  return scope.model.length >= 3 && !scope.topicExists(item, scope.model)
                }
                scope.topicToggle = function(item) {
                  if (scope.topicDisabled(item, scope.model)) return;
                  if (scope.topicExists(item, scope.model)) {
                    _.remove(scope.model, function(x) {
                      return x == item.categoryId
                    })
                  } else {
                    scope.model.push(item.categoryId)
                  }
                }

            }
        }
    })
    /*
    * Bank selector
    */
    .directive('fsBankSelector', function ($api) {
      return {
        restrict: 'AE',
        scope: {
          model: '=ngModel'
        },
        templateUrl: 'templates/fs-bank-selector.html',
        link: function(scope, elem, attrs, form){
                scope.banks = [];

                $api({
                  method: 'GET',
                  url: '/data/banks'
                }).then(function(data) {
                  scope.banks = data;
                }).catch(function(err) {
                  console.error("fsBankInfoSelector", err);
                });

        }
      }
    })
    .directive('fsMediaSelector', function ($api) {
      return {
        restrict: 'AE',
        scope: {
          model: '=ngModel'
        },
        templateUrl: 'templates/fs-media-selector.html',
        link: function(scope, elem, attrs, form){
                scope.medium = [];

                $api({
                  method: 'GET',
                  url: '/data/medium'
                }).then(function(data) {
                  scope.medium = data;
                }).catch(function(err) {
                  console.error("fsMediaSelector", err);
                });

        }
      }
    })
    .directive('fsCampaignCategorySelector', function ($api) {
      return {
        restrict: 'AE',
        scope: {
          model: '=ngModel'
        },
        templateUrl: 'templates/fs-campaign-category-selector.html',
        link: function(scope, elem, attrs, form){
                scope.categories = [];

                $api({
                  method: 'GET',
                  url: '/data/categories'
                }).then(function(data) {
                  scope.categories = data;
                }).catch(function(err) {
                  console.error("fsCampaignCategorySelector", err);
                });

        }
      }
    });


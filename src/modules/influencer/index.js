/**
 * influencer module
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.2
 */
'use strict';

var components = [
  require('../../components/common')
];

angular.module('app.influencer', components)
  .config(function($stateProvider) {
    $stateProvider
      .state('index', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'layout-public.html'
          },
          'menu@index': {
            templateUrl: 'menu.html',
            resolve: {
              profile: function($api, $q) {
                return {};
              }
            },
            controller: function($scope, profile) {
              $scope.profile = profile;
            }
          }
        }
      })
      .state('index-private', {
        abstract: true,
        views: {
          '@': {
            templateUrl: 'layout-private.html'
          }
        }
      })
      .state('profile', {
        parent: 'index-private',
        url: '/profile',
        views: {
          '': {
            controller: 'influencerAccountProfileController',
            templateUrl: 'account/influencer-profile.html'
          },
          'title@index-private': {
            templateUrl: 'account/title-profile.html'
          }
        }
      })
      .state('signin', {
        parent: 'index',
        url: '',
        views: {
          '': {
            controller: 'influencerAccountSigninController',
            templateUrl: 'account/influencer-account-signin.html'
          },
          'menu@index': {}
        }
      })
      .state('signup', {
        parent: 'index',
        abstract: true,
        url: '/signup',
        resolve: {
          socialProfile: function($storage) {
            return $storage.get('profile-signup');
          }
        },
        redirectTo: 'signup.1',
        views: {
          '@index': {
            controller: 'influencerAccountSignupController',
            templateUrl: 'account/influencer-account-signup.html'
          },
          'menu@index': {}
        }
      })
      .state('signup.1', {
        url: '',
        templateUrl: 'account/influencer-account-signup-1.html'
      })
      .state('signup.2', {
        templateUrl: 'account/influencer-account-signup-2.html'
      })
      .state('confirm', {
        parent: 'index',
        url: '/confirm',
        views: {
          '@index': {
            controller: 'influencerAccountConfirmController'
          },
          'menu@index': {}
        }
      })
      .state('campaign', {
        parent: 'index-private',
        url: '/campaign',
        views: {
          'title@index-private': {
            templateUrl : 'campaign/title.html'
          },
          '': {
            controller: 'influencerCampaignListController',
            templateUrl: 'campaign/influencer-campaign-list.html'
          }
        }

      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.influencer';

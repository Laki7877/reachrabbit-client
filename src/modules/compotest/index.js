/**
 * Compotest module
 *
 * @author     Pat Sabpisal <ecegrid@gmail.com
 * @since      0.0.1
 */
'use strict';

var components = [
  require('../../components/common')
];

angular.module('app.compotest', components)
  .config(function($stateProvider) {
    $stateProvider
      .state('compotest', {
        url: '/',
        resolve: {
        	admin: function($api, $storage) {
        		return $api({
  			      method: 'POST',
  			      url: '/login/admin',
  			      data: {
  			        email: 'admin@reachrabbit.com',
  			        password: '1234'
  			      }
  			    })
  			    .then(function(result) {
  			      $storage.putAuth(result.token);
  			    });
        	}
        },
        controller: 'compotestController',
        templateUrl: 'index.html'
      });
  });

require('bulk-require')(__dirname, ['**/*.js', '!index.js']);

module.exports = 'app.compotest';

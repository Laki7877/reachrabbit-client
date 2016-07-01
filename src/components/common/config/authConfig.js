/**
 * Setup satellizer configuration
 *
 * @author     Poon Wu <poon.wuthi@gmail.com
 * @since      0.0.1
 */
'use strict';

angular.module('app.common')
	.config(function($authProvider) {
		$authProvider.baseUrl = process.env.API_URI;
		$authProvider.facebook({
			clientId: process.env.FACEBOOK_APP_ID
		});

    $authProvider.google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube',
      redirectUri: 'http://localhost:3000/auth/google'
    });

	});

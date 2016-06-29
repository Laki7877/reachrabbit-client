/**
 * Brand signin form schema
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.3
 */
'use strict';

module.exports = function() {
  return {
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          title: 'Email address'
        },
        password: {
          type: 'string',
          title: 'Password'
        },
        rememberMe: {
          type: 'boolean',
          title: 'Remember me'
        }
      }
    },
    form: [
      {
        type: 'template',
        template: '<h2 class="form-signin-heading">Please sign in</h2>'
      },
      'email',
      'password',
      'rememberMe',
      {
        type: 'submit',
        style: 'btn-primary btn-block btn-lg',
        title: 'Sign in'
      }
    ]
  };
};

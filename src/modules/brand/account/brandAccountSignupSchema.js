/**
 * Brand signup form schema
 *
 * @author     Poon Wu <poon.wuthi@gmail.com>
 * @since      0.0.3
 */
'use strict';

module.exports = function() {
  return {
    options: {
      formDefaults: {
        ngModelOptions: {
          updateOn: 'blur'
        }
      }
    },
    schema: {
      type: 'object',
      properties: {
        brandName: {
          type: 'string',
          title: 'Brand Name'
        },
        name: {
          type: 'string',
          title: 'Name'
        },
        contactNumber: {
          type: 'string',
          format: 'number',
          title: 'Contact Number'
        },
        email: {
          type: 'string',
          format: 'email',
          title: 'E-mail'
        },
        confirmEmail: {
          type: 'string',
          title: 'E-mail (Confirm)'
        },
        password: {
          type: 'string',
          title: 'Password'
        },
        confirmPassword: {
          type: 'string',
          title: 'Password (Confirm)'
        }
      },
      required: ['brandName', 'name', 'contactNumber', 'email', '']
    },
    form: [
      {
        type: 'section',
        htmlClass: 'form-group',
        items: [
          {
            type: 'template',
            template: '<legend>Brand sign up</legend>'
          }
        ]
    },
      'brandName',
      'name',
      'contactNumber',
      'email',
      'confirmEmail',
      {
        key: 'password',
        type: 'password'
      },
      {
        key: 'confirmPassword',
        type: 'password'
      },
      {
        type: 'submit',
        style: 'btn-success',
        title: 'Sign Up'
      }
    ]
  }
};

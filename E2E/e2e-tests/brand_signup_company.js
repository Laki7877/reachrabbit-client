var loginLogout = require('../commons/brandLoginLogout.js');
var signUp = require('../commons/brandSignUp.js');

describe('Brand Sign up with company detail', function () {
    loginLogout.gotoLogin();
    loginLogout.gotoSignup();
    signUp.signUpSuccessCompany();
    loginLogout.logout();
});

var loginLogout = require('../commons/brandLoginLogout.js');
var signUp = require('../commons/brandSignUp.js');

describe('Brand Sign up with no company detail', function () {
    loginLogout.gotoLogin();
    loginLogout.gotoSignup();
    signUp.signUpSuccessNoCompany();
    loginLogout.logout();
});
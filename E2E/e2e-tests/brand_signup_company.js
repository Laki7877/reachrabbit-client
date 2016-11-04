var loginLogout = require('../commons/brandLoginLogout.js');
var signUp = require('../commons/brandSignUp.js');

describe('Brand Sign up with company detail', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    loginLogout.gotoLogin();
    loginLogout.gotoSignUp();
    signUp.signUpSuccessCompany();
    loginLogout.logout();
});

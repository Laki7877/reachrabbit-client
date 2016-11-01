var loginLogout = require('../commons/brandLoginLogout.js'),
    signUp = require('../commons/brandSignUp.js');

describe('Brand Sign up with no company detail', function () {
    beforeAll(function () {
        browser.get('portal.html#/brand-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    loginLogout.gotoSignup();
    signUp.signUpSuccessNoCompany();
    loginLogout.logout();
});
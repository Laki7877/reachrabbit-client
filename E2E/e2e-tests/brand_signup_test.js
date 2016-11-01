var loginLogout = require('../commons/brandLoginLogout.js');
describe('Brand Sign up', function () {
    beforeAll(function () {
        browser.get('portal.html#/brand-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    loginLogout.gotoSignup();
});

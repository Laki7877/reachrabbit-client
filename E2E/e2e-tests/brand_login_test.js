var loginLogout = require('../commons/brandLoginLogout.js');
describe('Brand Login', function () {
    beforeAll(function () {
        browser.get('portal.html#/brand-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    var email = browser.params.brand_login.user,
        password = browser.params.brand_login.password;
    loginLogout.loginSuccess(email,password);
    loginLogout.logout();
});

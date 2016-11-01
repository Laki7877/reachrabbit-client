var loginLogout = require('../commons/adminLoginLogout.js');
describe('Admin Login', function () {
    beforeAll(function () {
        browser.get('portal.html#/admin-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    var email = browser.params.admin_login.user,
        password = browser.params.admin_login.password;
    loginLogout.loginSuccess(email,password);
    loginLogout.logout();
});

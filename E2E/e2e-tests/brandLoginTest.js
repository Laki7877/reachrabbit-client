var loginLogout = require('../commons/brandLoginLogout.js');
describe('Brand Login', function () {
    beforeAll(function () {
        browser.get('portal.html#/brand-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    var email = 'brand@reachrabbit.com',
        password = 'test1234';
    loginLogout.loginSuccess(email,password);
    loginLogout.logout();
});

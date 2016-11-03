var loginLogout = require('../commons/brandLoginLogout.js');
describe('Brand Login', function () {
    browser.ignoreSynchronization = true;
    loginLogout.gotoLogin();
    loginLogout.loginSuccess();
    loginLogout.logout();
    browser.ignoreSynchronization = false;
});

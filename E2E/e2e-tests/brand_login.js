var loginLogout = require('../commons/brandLoginLogout.js');
describe('Brand Login', function () {
    browser.ignoreSynchronization = true;
    loginLogout.loginSuccess();
    loginLogout.logout();
    browser.ignoreSynchronization = false;
});

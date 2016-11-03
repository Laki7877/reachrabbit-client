var loginLogout = require('../commons/adminLoginLogout.js');

describe('Admin Login', function () {
    browser.ignoreSynchronization = true;
    loginLogout.gotoAdminLogin();
    loginLogout.loginSuccess();
    loginLogout.logout();
    browser.ignoreSynchronization = false;
});

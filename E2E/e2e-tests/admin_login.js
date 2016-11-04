var loginLogout = require('../commons/adminLoginLogout.js');

describe('Admin Login', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    loginLogout.gotoAdminLogin();
    loginLogout.loginSuccess();
    loginLogout.logout();
});

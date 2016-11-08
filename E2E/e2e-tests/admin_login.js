var admin = require('../commons/admin.js');

describe('Admin Login', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    admin.gotoAdminLogin();
    admin.loginSuccess();
    admin.logout();
});

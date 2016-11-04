var loginLogout = require('../commons/brandLoginLogout.js');
describe('Brand Login', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    loginLogout.gotoLogin();
    loginLogout.loginSuccess();
    loginLogout.logout();
});

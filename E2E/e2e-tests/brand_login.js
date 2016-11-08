var brand = require('../commons/brand.js');

describe('Brand Login', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    brand.gotoLogin();
    brand.loginSuccess();
    brand.logout();
});

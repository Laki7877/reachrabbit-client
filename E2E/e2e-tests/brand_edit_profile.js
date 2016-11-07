var brand = require('../commons/brand.js');

describe('Brand Edit Profile', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    brand.gotoLogin();
    brand.loginSuccess();
    brand.gotoProfile();
    brand.editProfile();
    brand.logout();
});

var brand = require('../commons/brand.js');

describe('Brand Sign up with company detail', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    brand.gotoLogin();
    brand.gotoSignUp();
    brand.signUpSuccessCompany();
    brand.logout();
});

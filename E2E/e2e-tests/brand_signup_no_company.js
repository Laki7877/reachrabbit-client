var brand = require('../commons/brand.js');


describe('Brand Sign up with no company detail', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    brand.gotoLogin();
    brand.gotoSignUp();
    brand.signUpSuccessNoCompany();
    brand.logout();
});
var influencer = require('../commons/influencer.js');


describe('Influencer signup with email', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    influencer.gotoLogin();
    influencer.gotoSignUpEmail();
    influencer.signUpEmail();
});


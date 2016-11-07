var loginLogout = require('../commons/influencerLoginLogout.js');
describe('Influencer Login', function () {

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

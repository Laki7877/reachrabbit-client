var influencer = require('../commons/influencer.js');
//var loginLogout = require('../commons/influencerLoginLogout.js');

describe('Influencer Login', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    influencer.gotoLogin();
    influencer.loginSuccess();
    influencer.logout();
});

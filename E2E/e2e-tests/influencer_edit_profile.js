var loginLogout = require('../commons/influencerLoginLogout.js');
var influencerHeader = require('../commons/influencerHeader.js');
var influencerProfile = require('../commons/influencerProfile.js');

describe('Influencer Edit Profile', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    loginLogout.gotoLogin();
    loginLogout.loginSuccess();
    influencerHeader.gotoProfile();
    influencerProfile.editProfile();
    loginLogout.logout();
});

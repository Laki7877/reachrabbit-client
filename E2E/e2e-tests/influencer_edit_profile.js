var influencer = require('../commons/influencer.js');
//var loginLogout = require('../commons/influencer.js');
//var influencerHeader = require('../commons/influencerHeader.js');
//var influencerProfile = require('../commons/influencerProfile.js');

describe('Influencer Edit Profile', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    influencer.gotoLogin();
    influencer.loginSuccess();
    influencer.gotoProfile();
    influencer.editProfile();
    influencer.logout();
});

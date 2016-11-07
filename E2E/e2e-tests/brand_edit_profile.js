var loginLogout = require('../commons/brandLoginLogout.js');
var brandHeader = require('../commons/brandHeader.js');
var brandProfile = require('../commons/brandProfile.js');

describe('Brand Edit Profile', function () {

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    loginLogout.gotoLogin();
    loginLogout.loginSuccess();
    brandHeader.gotoProfile();
    brandProfile.editProfile();
    loginLogout.logout();
});

var loginLogout = require('../commons/brandLoginLogout.js');
var brandCampaign = require('../commons/brandCampaign.js');
var brandHeader = require('../commons/brandHeader');

describe('Create new Campaign', function () {
        beforeEach(function () {
            browser.ignoreSynchronization = true;
        });
        afterEach(function() {
            browser.sleep(1000);
        });
        loginLogout.gotoLogin();
        loginLogout.loginSuccess();
        brandCampaign.gotoCreateCampaign();
        brandCampaign.crateDraftCampaign();
        brandHeader.gotoCampaignList();
        loginLogout.logout();
});


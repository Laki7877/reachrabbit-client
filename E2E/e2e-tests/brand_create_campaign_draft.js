var brand = require('../commons/brand.js');

describe('Create new Campaign', function () {
        beforeEach(function () {
            browser.ignoreSynchronization = true;
        });
        afterEach(function() {
            browser.sleep(1000);
        });
        brand.gotoLogin();
        brand.loginSuccess();
        brand.gotoCreateCampaign();
        brand.crateDraftCampaign();
        brand.gotoCampaignList();
        brand.logout();
});


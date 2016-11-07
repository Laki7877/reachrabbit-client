var brand = require('../commons/brand.js');

describe('Publish Campaign', function(){
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
    brand.publishCampaign();
    brand.hideRabbitModel();
    brand.gotoCampaignList();
    brand.logout();
});



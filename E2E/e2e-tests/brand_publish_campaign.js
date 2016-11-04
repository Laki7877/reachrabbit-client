var loginLogout = require('../commons/brandLoginLogout.js');
var brandCampaign = require('../commons/brandCampaign.js');
var brandHeader = require('../commons/brandHeader');

describe('Starting test', function(){
    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
    describe('Create new Campaign', function () {
        loginLogout.gotoLogin();
        loginLogout.loginSuccess();
        brandCampaign.gotoCreateCampaign();
        brandCampaign.crateDraftCampaign();
        brandCampaign.publishCampaign();
        brandCampaign.hideRabbitModel();
        brandHeader.gotoCampaignList();
        loginLogout.logout();
    });
});



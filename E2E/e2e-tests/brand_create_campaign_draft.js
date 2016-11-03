var loginLogout = require('../commons/brandLoginLogout.js');
var brandCampaign = require('../commons/brandCampaign.js');
describe('Create new Campaign', function () {
    browser.ignoreSynchronization = true;
    loginLogout.loginSuccess();
    brandCampaign.gotoCreateCampaign();
    brandCampaign.crateDraftCampaign();
    loginLogout.logout();
    browser.ignoreSynchronization = false;
});

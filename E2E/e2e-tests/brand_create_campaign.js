var loginLogout = require('../commons/brandLoginLogout.js');
var brandCampaign = require('../commons/brandCampaign.js');
describe('Create new Campaign', function () {
    beforeAll(function () {
        browser.get('portal.html#/brand-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
    var email = browser.params.brand_login.user,
        password = browser.params.brand_login.password;
    loginLogout.loginSuccess(email,password);
    brandCampaign.gotoCreateCampaign();
    browser.ignoreSynchronization = true;
    loginLogout.logout();
    browser.ignoreSynchronization = false;
});

var admin = require('../commons/admin.js');
var adminHeader = require('../page_objects/adminHeaderPage.js');
var moniker = require('moniker');
var rs = require('randomstring');
var rn = require('random-number');

describe('Admin campaign list', function() {
	beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function() {
        browser.sleep(1000);
    });
	admin.gotoAdminLogin();
	admin.loginSuccess();
	it('should view all campaigns', function() {
		adminHeader.clickCampaignList();
		browser.getCurrentUrl().then(function(url) {
			expect(url).toContain('admin-campaign-list');
		});
		browser.sleep(1000);
		var result = element.all(by.repeater("campaign in campaigns.content"));
		result.count().then(function(ct) {
			console.log(ct);
			expect(ct >= 1).toBeTruthy();
		});
	});
	it('should view detail campaign', function() {
		var result = element.all(by.repeater("campaign in campaigns.content")).get(0);
		result.element(by.css('.btn-campaign-detail')).click();
		browser.sleep(1000);
		browser.getCurrentUrl().then(function(url) {
			expect(url).toContain('admin-campaign-detail');
		});
	});
	admin.logout();
});
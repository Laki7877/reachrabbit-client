var loginLogout = require('../commons/adminLoginLogout.js'),
	adminHeader = require('../page_objects/adminHeaderPage.js'),
	moniker = require('moniker'),
	rs = require('randomstring'),
	rn = require('random-number');

describe('Admin generate referral code', function() {
	// test data
    var email = browser.params.admin_login.user,
        password = browser.params.admin_login.password;
    var referralCode = {
    	email: moniker.choose() + '@test',
    	description: 'TEST campaign id:' + rs.generate(),
    	commission: rn({
			min: 1,
			max: 99,
			integer: true
		})
    };

	beforeAll(function() {
        browser.get('portal.html#/admin-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
	    loginLogout.loginSuccess(email,password);
	});
	it('should go to referral code page', function() {
		adminHeader.clickReferralCodeList();
		browser.getCurrentUrl().then(function(url) {
			expect(url).toContain('#/admin-referral-code-list');
		});
	});
	it('should contain referral code form', function() {
		expect(element(by.model('formData.email')).isPresent()).toBe(true);
		expect(element(by.model('formData.description')).isPresent()).toBe(true);
		expect(element(by.model('formData.commission')).isPresent()).toBe(true);
	});
	it('should save referral code form', function() {
		var state = {
			email: element(by.model('formData.email')),
			description: element(by.model('formData.description')),
			commission: element(by.model('formData.commission')),
			submitBtn: element(by.id('admin-referral-code-list-submit-btn'))
		};

		state.email.sendKeys(referralCode.email);
		state.description.sendKeys(referralCode.description);
		state.commission.sendKeys(referralCode.commission);
		state.submitBtn.click();
	});
	it('should contain new entry', function() {
		browser.sleep(2000);
		result = element.all(by.repeater("ref in referrals.content")).get(0);
		expect(result.element(by.css('.col-email')).getText()).toEqual(referralCode.email);
	});
});
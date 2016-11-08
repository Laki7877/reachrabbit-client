var brand = require('../commons/brand.js'),
	influencer = require('../commons/influencer.js');

describe('Brand chat with influencer', function() {
	beforeEach(function() {
		browser.ignoreSynchronization = true;
	});
	afterEach(function() {
		browser.sleep(1000);
	});
	brand.gotoLogin();
	brand.loginSuccess();
	brand.gotoInboxSelection();
	brand.gotoWorkroom();
	brand.chatWorkroom();
});
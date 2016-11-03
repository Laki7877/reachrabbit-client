var loginPage = require('../page_objects/adminLoginPage.js'),
    adminHeader = require('../page_objects/adminHeaderPage.js'),
    common = require('./common.js');

exports.loginSuccess = function (email, password) {
    it('Sign in component should exist' , function() {
        expect(loginPage.email.isPresent()).toBe(true);
        expect(loginPage.password.isPresent()).toBe(true);
        expect(loginPage.submitBtn.isPresent()).toBe(true);
        //expect(common.hasClass(loginPage.alert,'ng-hide') ).toBe(true);
    });
    it('Should be able to fill sign in form data' , function() {
        loginPage.setEmail(email);
        loginPage.setPassword(password);
        loginPage.email.getAttribute('value').then(function(value){
            expect(value.length).toBeGreaterThan(0);
            expect(value.length).toBeGreaterThan(0);
        });
        loginPage.password.getAttribute('value').then(function(value){
            expect(value.length).toBeGreaterThan(0);
        });
        loginPage.clickLogin();
        browser.sleep(3000);
        common.waitForCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/admin-transaction-history');
        });
    });
};

exports.logout = function () {
    it('Logout button should exist' , function() {
        browser.ignoreSynchronization = true;
        adminHeader.clickPayoutHistory();
        expect(adminHeader.signoutBtn.isPresent()).toBe(true);
    });
    it('Should be able to click sign out' , function() {
        adminHeader.clickSignout();
        common.waitForCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/admin-login');
        });
        browser.ignoreSynchronization = false;
    });
};

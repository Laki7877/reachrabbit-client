var loginPage = require('../page_objects/brandLoginPage.js'),
    brandHeader = require('../page_objects/brandHeaderPage.js'),
    common = require('./common.js');
    
exports.gotoSignup = function() {
    it('Sign up link should exist',function(){
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
        loginPage.clickSignup();
    });
};

exports.loginSuccess = function () {
    browser.get('portal.html#/brand-login');
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
    it('Sign in component should exist' , function() {
        expect(loginPage.email.isPresent()).toBe(true);
        expect(loginPage.password.isPresent()).toBe(true);
        expect(loginPage.submitBtn.isPresent()).toBe(true);
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
        expect(common.hasClass(loginPage.alert,'ng-hide') ).toBe(true);
    });
    it('Should be able to fill sign in form data' , function() {
        var email = browser.params.brand_login.user;
        var password = browser.params.brand_login.password;
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
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};

exports.logout = function () {
    it('Logout button should exist' , function() {
        expect(brandHeader.signoutBtn.isPresent()).toBe(true);
    });
    it('Should be able to click sign out' , function() {
        brandHeader.clickSignout();
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-login');
        });
    });
};
var loginPage = require('../page_objects/brandLoginPage.js'),
    brandHeader = require('../page_objects/brandHeaderPage.js'),
    common = require('./common.js');


exports.gotoSignup = function() {
    it('Should exits',function(){
        expect(loginPage.form.signUpBtn.isPresent()).toBe(true);
        loginPage.form.clickSignup();
    });
    
};

exports.loginSuccess = function (email, password) {
    it('Should exits' , function() {
        expect(loginPage.form.email.isPresent()).toBe(true);
        expect(loginPage.form.password.isPresent()).toBe(true);
        expect(loginPage.form.submitBtn.isPresent()).toBe(true);
        expect(loginPage.form.signUpBtn.isPresent()).toBe(true);
        expect(common.hasClass(loginPage.form.alert,'ng-hide') ).toBe(true);
    });
    it('Should fill form' , function() {
        loginPage.form.setEmail(email);
        loginPage.form.setPassword(password);
        loginPage.form.email.getAttribute('value').then(function(value){
            expect(value.length).toBeGreaterThan(0);
            expect(value.length).toBeGreaterThan(0);
        });
        loginPage.form.password.getAttribute('value').then(function(value){
            expect(value.length).toBeGreaterThan(0);
        });
        loginPage.form.clickLogin();
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};

exports.logout = function () {
    it('Should exits' , function() {
        expect(brandHeader.form.signoutBtn.isPresent()).toBe(true);
    });
    it('Should click signout' , function() {
        brandHeader.form.clickSignout();
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-login');
        });
    });
};
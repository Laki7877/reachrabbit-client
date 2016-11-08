var loginPage = require('../page_objects/adminLoginPage.js');
var adminHeader = require('../page_objects/adminHeaderPage.js');
var common = require('./common.js');


exports.gotoAdminLogin = function(){
     it('Should go to admin login page', function() {
        browser.get('portal.html#/admin-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();'); 
    });
};

exports.loginSuccess = function () {
    it('Sign in component should exist' , function() {
        expect(loginPage.email.isPresent()).toBe(true);
        expect(loginPage.password.isPresent()).toBe(true);
        expect(loginPage.submitBtn.isPresent()).toBe(true);
        //expect(common.hasClass(loginPage.alert,'ng-hide') ).toBe(true);
    });
    it('Should be able to fill sign in form data' , function() {
        var email = browser.params.admin_login.user;
        var password = browser.params.admin_login.password;
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
    });
    it('Should login successful' , function() {
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/admin-transaction-history');
        });
    })
};

exports.logout = function () {
    it('Logout button should exist' , function() {
        expect(adminHeader.signoutBtn.isPresent()).toBe(true);
    });
    it('Should be able to click sign out' , function() {
        adminHeader.clickSignout();
    });
    it('Should go to login page',function(){
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/admin-login');
        });
    });
};

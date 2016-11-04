var loginPage = require('../page_objects/influencerLoginPage.js');

exports.gotoSignUp = function() {
    it('Sign up link should exist',function(){
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
        loginPage.clickSignUp();
    });
};

exports.gotoLogin = function() {
    it('Should go to influencer login page', function() {
        browser.get('portal#/influencer-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
};

exports.loginSuccess = function () {
    it('Sign in component should exist' , function() {
        expect(loginPage.email.isPresent()).toBe(true);
        expect(loginPage.password.isPresent()).toBe(true);
        expect(loginPage.loginBtn.isPresent()).toBe(true);
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
    });
    it('Should be able to fill sign in form data' , function() {
        var email = browser.params.influencer_login.user;
        var password = browser.params.influencer_login.password;
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
            expect(actualUrl).toContain('#/influencer-campaign-list');
        });
    })
};
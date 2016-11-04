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

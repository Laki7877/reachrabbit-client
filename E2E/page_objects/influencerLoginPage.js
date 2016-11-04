var influencerLoginPage = function () {
    'use strict';

    this.email = element(by.model('username'));
    this.password  = element(by.model('password'));
    this.loginBtn = element(by.id('influencer-login-login-btn'));
    this.signUpBtn = element(by.id('influencer-login-sign-up-btn'));
    //******************** functions *******************//
    this.setEmail = function (email) {
        this.email.clear();
        this.email.sendKeys(email);
    };
    this.setPassword = function (password) {
        this.password.clear();
        this.password.sendKeys(password);
    };
    this.clickLogin = function () {
        this.loginBtn.click();
    };
    this.clickSignUp = function() {
        this.signUpBtn.click();
    };
};
module.exports = new influencerLoginPage();
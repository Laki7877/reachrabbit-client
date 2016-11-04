var influencerLoginPage = function () {
    'use strict';

    this.email = element(by.model('formData.username'));
    this.password  = element(by.model('formData.password'));
    this.loginBtn = element(by.id('influencer-login-login-btn'));
    this.signUpBtn = element(by.id('influencer-login-sign-up-btn'));
    //******************** functions *******************//
    this.clickLogin = function () {
        this.loginBtn.click();
    };
    this.clickSignUp = function() {
        this.signUpBtn.click();
    };
};
module.exports = new influencerLoginPage();
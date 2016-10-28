var brandLoginPage = function () {
    'use strict';

    this.email = element(by.model('formData.username'));
    this.password  = element(by.model('formData.password'));
    this.submitBtn = element(by.css('.btn-primary'));
    this.signUpBtn = element(by.css('.id-view-brand-login-login-btn'));
    this.alert = element(by.css('div[nc-alert=alert] div[role=alert]'));
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
        this.submitBtn.click();
    };
};
module.exports = {
    form: new brandLoginPage()
};
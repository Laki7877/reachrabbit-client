var adminLoginPage = function () {
    'use strict';

    this.email = element(by.model('formData.username'));
    this.password  = element(by.model('formData.password'));
    this.submitBtn = element(by.id('admin-login-login-btn'));
    this.alert = element(by.id('admin-login-alert'));
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
module.exports = new adminLoginPage();
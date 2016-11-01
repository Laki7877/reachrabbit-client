var brandSignUpPage = function () {
    'use strict';

    this.brandName = element(by.model('formData.brandName'));
    this.name = element(by.model('formData.name'));
    this.phoneNumber = element(by.model('formData.phoneNumber'));
    this.email = element(by.model('formData.email'));
    this.password = element(by.model('formData.password'));
    this.isCompany = element(by.model('formData.isCompany'));
    this.companyName = element(by.model('formData.companyName'));
    this.companyTaxId = element(by.model('formData.companyTaxId'));
    this.companyAddress = element(by.model('formData.companyAddress'));
    this.submit_btn = element(by.css('.btn-primary'));
    //******************** functions *******************//
    
    
};
module.exports = new brandSignUpPage();
var signUpPage = require('../page_objects/brandSignUpPage.js');
var Chance = require('chance');
var chance = new Chance();

exports.signUpSuccessCompany = function() {
    it('Sign up component should exist',function(){
        expect(signUpPage.brandName.isPresent()).toBe(true);
        expect(signUpPage.name.isPresent()).toBe(true);
        expect(signUpPage.phoneNumber.isPresent()).toBe(true);
        expect(signUpPage.email.isPresent()).toBe(true);
        expect(signUpPage.password.isPresent()).toBe(true);
        expect(signUpPage.isCompany.isPresent()).toBe(true);
        expect(signUpPage.submit_btn.isPresent()).toBe(true);
        signUpPage.isCompany.click();
        expect(signUpPage.companyName.isPresent()).toBe(true);
        expect(signUpPage.companyTaxId.isPresent()).toBe(true);
        expect(signUpPage.companyAddress.isPresent()).toBe(true);
    });
    it('Should be able to fill sign up form data',function(){
        signUpPage.name.sendKeys(chance.capitalize(chance.word({ length: 10 })));
        signUpPage.brandName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Brand");
        signUpPage.phoneNumber.sendKeys(chance.phone({ formatted: false }));
        signUpPage.email.sendKeys(browser.params.brand_login.user);
        signUpPage.password.sendKeys(browser.params.brand_login.password);
        signUpPage.companyName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Co Ltd");
        signUpPage.companyTaxId.sendKeys("12341234");
        signUpPage.companyAddress.sendKeys("Somewhere in Space");
        signUpPage.companyAddress.sendKeys(protractor.Key.TAB);
        signUpPage.companyAddress.sendKeys(protractor.Key.ENTER);
    });
};

exports.signUpSuccessNoCompany = function() {
    it('Sign up component should exist',function(){
        expect(signUpPage.brandName.isPresent()).toBe(true);
        expect(signUpPage.name.isPresent()).toBe(true);
        expect(signUpPage.phoneNumber.isPresent()).toBe(true);
        expect(signUpPage.email.isPresent()).toBe(true);
        expect(signUpPage.password.isPresent()).toBe(true);
        expect(signUpPage.isCompany.isPresent()).toBe(true);
        expect(signUpPage.submit_btn.isPresent()).toBe(true);
    });
    it('Should be able to fill sign up form data',function(){
        signUpPage.name.sendKeys(chance.capitalize(chance.word({ length: 10 })));
        signUpPage.brandName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Brand");
        signUpPage.phoneNumber.sendKeys(chance.phone({ formatted: false }));
        signUpPage.email.sendKeys(browser.params.brand_login.user);
        signUpPage.password.sendKeys(browser.params.brand_login.password);
    });
};


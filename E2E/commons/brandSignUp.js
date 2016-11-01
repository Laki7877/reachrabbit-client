var signUpPage = require('../page_objects/brandSignUpPage.js');
var Chance = require('chance');
var chance = new Chance();

exports.signUpSuccessCompany = function() {
    it('Sign up component should exist',function(){
        expect(signUpPage.form.brandName.isPresent()).toBe(true);
        expect(signUpPage.form.name.isPresent()).toBe(true);
        expect(signUpPage.form.phoneNumber.isPresent()).toBe(true);
        expect(signUpPage.form.email.isPresent()).toBe(true);
        expect(signUpPage.form.password.isPresent()).toBe(true);
        expect(signUpPage.form.isCompany.isPresent()).toBe(true);
        expect(signUpPage.form.submit_btn.isPresent()).toBe(true);
        expect(signUpPage.form.login_link.isPresent()).toBe(true);
        signUpPage.form.isCompany.click();
        expect(signUpPage.form.companyName.isPresent()).toBe(true);
        expect(signUpPage.form.companyTaxId.isPresent()).toBe(true);
        expect(signUpPage.form.companyAddress.isPresent()).toBe(true);
        signUpPage.form.submit_btn.click();
        expect($('.alert.alert-danger').isPresent()).toBe(true);
    });
    it('Should be able to fill sign up form data',function(){
        signUpPage.form.name.sendKeys(chance.capitalize(chance.word({ length: 10 })));
        signUpPage.form.brandName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Brand");
        signUpPage.form.phoneNumber.sendKeys(chance.phone({ formatted: false }));
        signUpPage.form.email.sendKeys(browser.params.brand_login.user);
        signUpPage.form.password.sendKeys(browser.params.brand_login.password);
        signUpPage.form.companyName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Co Ltd");
        signUpPage.form.companyTaxId.sendKeys("12341234");
        signUpPage.form.companyAddress.sendKeys("Somewhere in Space");
        signUpPage.form.companyAddress.sendKeys(protractor.Key.TAB);
        signUpPage.form.companyAddress.sendKeys(protractor.Key.ENTER);
        signUpPage.form.submit_btn.click();
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};

exports.signUpSuccessNoCompany = function() {
    it('Sign up component should exist',function(){
        expect(signUpPage.form.brandName.isPresent()).toBe(true);
        expect(signUpPage.form.name.isPresent()).toBe(true);
        expect(signUpPage.form.phoneNumber.isPresent()).toBe(true);
        expect(signUpPage.form.email.isPresent()).toBe(true);
        expect(signUpPage.form.password.isPresent()).toBe(true);
        expect(signUpPage.form.isCompany.isPresent()).toBe(true);
        expect(signUpPage.form.submit_btn.isPresent()).toBe(true);
        expect(signUpPage.form.login_link.isPresent()).toBe(true);
        //signUpPage.form.submit_btn.click();
        //expect($('.alert.alert-danger').isPresent()).toBe(true);
    });
    it('Should be able to fill sign up form data',function(){
        signUpPage.form.name.sendKeys(chance.capitalize(chance.word({ length: 10 })));
        signUpPage.form.brandName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Brand");
        signUpPage.form.phoneNumber.sendKeys(chance.phone({ formatted: false }));
        signUpPage.form.email.sendKeys(browser.params.brand_login.user);
        signUpPage.form.password.sendKeys(browser.params.brand_login.password);
        signUpPage.form.submit_btn.click();
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};


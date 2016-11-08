var campaignList = require('../page_objects/brandCampaignListPage.js');
var campaignDraft = require('../page_objects/brandCampaignDraftPage.js');
var campaignDetail = require('../page_objects/brandCampaignDetailPage.js');
var brandHeader = require('../page_objects/brandHeaderPage.js');
var brandProfile = require('../page_objects/brandProfilePage.js');
var brandInbox = require('../page_objects/brandInboxPage.js');
var brandWorkroom = require('../page_objects/brandWorkroomPage.js');
var loginPage = require('../page_objects/brandLoginPage.js');
var signUpPage = require('../page_objects/brandSignUpPage.js');
var Chance = require('chance');
var chance = new Chance();
var path = require('path');
var common = require('./common.js');

exports.gotoInboxSelection = function() {
    it('Should enter selection inbox', function() {
        brandHeader.clickInboxSelection();
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(url) {
            expect(url).toContain('Selection');
        });
    });
};

exports.gotoWorkroom = function() {
    it('Should enter workroom', function() {
        brandInbox.gotoWorkroom(0);
        browser.sleep(2000);
        browser.getCurrentUrl().then(function(url) {
            expect(url).toContain('brand-workroom');
        });
    });
};

exports.chatWorkroom = function() {
    it('Should chat with influencer', function() {
        var word = chance.word();
        brandWorkroom.messageTextarea.sendKeys(word);
        brandWorkroom.submitBtn.click();
        browser.sleep(2000);
        expect(brandWorkroom.items.last().element(by.css('.my-message-content')).getText()).toEqual(word);
    });
};

exports.hideRabbitModel = function() {
    it('Modal component should exist', function(){
        expect(campaignDetail.modalCampaignBtn.isPresent()).toBe(true);
        expect(campaignDetail.hideCheckbox.isPresent()).toBe(true);
    });
    it('Should click check box', function() {
        campaignDetail.hideCheckbox.click();
    });
    it('Should click modal button', function(){
        campaignDetail.modalCampaignBtn.click();
    });
};

exports.gotoCreateCampaign = function(){
    it('New campaign button should exist',function(){
        expect(campaignList.newCampaignBtn.isPresent()).toBe(true);
    });
    it('Should click new campaign button',function(){
        campaignList.newCampaignBtn.click();
    });
};

exports.publishCampaign = function() {
    it('Publish button should exist', function(){
        expect(campaignDraft.publish_btn.isPresent()).toBe(true);
    });
    it('Should click publish button', function(){
        campaignDraft.publish_btn.click();
    });
};

exports.createDraftCampaign = function() {
    it('Create new campaign component should exist',function() {
        browser.ignoreSynchronization = true;
        expect(campaignDraft.description.isPresent()).toBe(true);
        expect(campaignDraft.objectiveChoice.isPresent()).toBe(true);
        expect(campaignDraft.workType.isPresent()).toBe(true);
        expect(campaignDraft.website.isPresent()).toBe(true);
        expect(campaignDraft.budget.isPresent()).toBe(true);
        expect(campaignDraft.save_draft_btn.isPresent()).toBe(true);
        expect(campaignDraft.proposalDeadline.isPresent()).toBe(true);
        expect(campaignDraft.category.isPresent()).toBe(true);
        expect(campaignDraft.productName.isPresent()).toBe(true);
        expect(campaignDraft.uploaders.count()).toEqual(2);
        browser.ignoreSynchronization = false;
    });
    it('Should be able to fill campaign form', function(){
        var fileToUpload = 'cyanthumb.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        var campaignName = chance.name() + " " + chance.ssn({ dashes: false });;
        campaignDraft.objectiveChoice.click();
        campaignDraft.workType.click();
        campaignDraft.facebookIcon.click();
        campaignDraft.googleIcon.click();
        campaignDraft.instagramIcon.click();
        campaignDraft.description.sendKeys(chance.paragraph({ sentences: 5 }));
        campaignDraft.productName.sendKeys(campaignName);
        campaignDraft.category.sendKeys("แ");
        campaignDraft.uploaders.get(0).sendKeys(absolutePath);
        campaignDraft.website.sendKeys(chance.url());
        campaignDraft.budget.sendKeys("0");
    });
    it('Should open croper',function(){
        browser.sleep(2000);
        campaignDraft.doneCropBtn.click();
    });
    it('Should open date picker', function(){
        campaignDraft.proposalDeadline.click();
    });
    it('Should click next month', function(){
        campaignDraft.nextMonthBtn.click();
    });
    it('Should pick up date', function(){
        campaignDraft.dateCalendar.get(28 + 2).click();
    });
    it('Should be able to click save draft', function(){
        campaignDraft.save_draft_btn.click();
    });
    it('Should save successful', function(){
        expect(campaignDraft.alert.isPresent()).toBe(true);
    });
};

exports.gotoProfile = function () {
    it('Should have profile dropdown' , function() {
        expect(brandHeader.profileDropdownBtn.isPresent()).toBe(true);
        brandHeader.profileDropdownBtn.click();
    });
    it('Should have profile button' , function() {
        expect(brandHeader.profileButton.isPresent()).toBe(true);
        brandHeader.profileButton.click();
    });
    it('Should go profile page',function(){
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-profile');
        });
    });
};

exports.gotoCampaignList = function() {
    it('Button campaign list should exists', function(){
        expect(brandHeader.campaignListBtn.isPresent()).toBe(true);
    });
    it('Should click campaign list button', function(){
        brandHeader.clickCampaignList();
    });
    it('Should goto campaign list successful', function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};

exports.gotoCart = function() {
    it('Button cart should exists', function() {
        expect(brandHeader.cartBtn.isPresent()).toBe(true);
    });
    it('Should click cart button', function(){
        brandHeader.clickCart();
    });
    it('Should goto cart successful', function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-cart');
        });
    });
};


exports.gotoSignUp = function() {
    it('Sign up link should exist',function(){
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
        loginPage.clickSignup();
    });
};

exports.gotoLogin = function() {
    it('Should go to brand login page', function() {
        browser.get('portal#/brand-login');
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

};

exports.loginSuccess = function () {
    it('Sign in component should exist' , function() {
        expect(loginPage.email.isPresent()).toBe(true);
        expect(loginPage.password.isPresent()).toBe(true);
        expect(loginPage.submitBtn.isPresent()).toBe(true);
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
        expect(common.hasClass(loginPage.alert,'ng-hide') ).toBe(true);
    });
    it('Should be able to fill sign in form data' , function() {
        var email = browser.params.brand_login.user;
        var password = browser.params.brand_login.password;
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
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    })
};

exports.logout = function () {
    it('Logout button should exist' , function() {
        expect(brandHeader.signoutBtn.isPresent()).toBe(true);
    });
    it('Should be able to click sign out' , function() {
        brandHeader.clickSignout();
    });
    it('Should go login page',function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-login');
        });
    });
};





exports.editProfile = function(){
     var expectations = {
        about: chance.paragraph({ sentences: 1 }),
        name: chance.word({ syllables: 4 }),
        website: chance.url()
    };
    it('All input should exits', function(){
        expect(brandProfile.about.isPresent()).toBe(true);
        expect(brandProfile.name.isPresent()).toBe(true);
        expect(brandProfile.website.isPresent()).toBe(true);
        expect(brandProfile.uploader.isPresent()).toBe(true);
        expect(brandProfile.submit_btn.isPresent()).toBe(true);
    });
    it('Should upload image', function(){
        var fileToUpload = 'greenthumb.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        brandProfile.uploader.sendKeys(absolutePath);
    });
    it('Cropper should appear', function(){
        expect(brandProfile.doneCropperBtn.isPresent()).toBe(true);
        brandProfile.doneCropperBtn.click();
        browser.sleep(2000);
    });
    it('Should fill form', function(){
        brandProfile.about.clear();
        brandProfile.name.clear();
        brandProfile.website.clear();

        brandProfile.about.sendKeys(expectations.about);
        brandProfile.name.sendKeys(expectations.name);
        brandProfile.website.sendKeys(expectations.website);
    });
    it('Should click button save', function(){
        browser.sleep(1000);
        brandProfile.submit_btn.click();
    });
    it('Should refresh page', function(){
        browser.driver.navigate().refresh();
    });
    it('Should save success', function() {
        expect(brandProfile.thumbImage.isPresent()).toBe(true);
        expect(brandProfile.about.getAttribute('value')).toEqual(expectations.about);
        expect(brandProfile.name.getAttribute('value')).toEqual(expectations.name);
        expect(brandProfile.website.getAttribute('value')).toEqual(expectations.website);
    });
};



exports.signUpSuccessCompany = function() {
    it('Sign up component should exist',function() {
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
    });
    it('Should be able to click sign up button', function() {
        signUpPage.submit_btn.click();
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
    it('Should be able to click sign up button', function() {
        signUpPage.submit_btn.click();
    });
};



var influencerHeaderPage = require('../page_objects/influencerHeaderPage.js');
var loginPage = require('../page_objects/influencerLoginPage.js');
var influencerSignup = require('../page_objects/influencerSignupPage.js');
var influencerProfile = require('../page_objects/influencerProfilePage.js');
var influencerCampaign = require('../page_objects/influencerCampaignPage');
var Chance = require('chance');
var chance = new Chance();
var path = require('path');
var common = require('./common.js');

exports.gotoCampaign = function(id) {
    it('Should open campaign', function() {
        browser.get('portal.html#/influencer-campaign-detail/' + id)
            .then(function() {
                browser.getCurrentUrl().then(function(url) {
                    expect(url).toContain('influencer-campaign-detail');
                });
            });
    });
};
exports.proposeCampaign = function() {
    it('Should open proposal modal', function() {
        influencerCampaign.proposeBtn.click();
        browser.sleep(2000);
        expect(influencerCampaign.submitProposalBtn.isPresent()).toBe(true);
    });

    it('Should submit proposal', function() {
        influencerCampaign.YtCheckbox.click().then(function () {
            influencerCampaign.description.sendKeys(chance.paragraph({ sentences: 5 }));
            influencerCampaign.price.sendKeys(proposedPrice);
            influencerCampaign.completionTime.sendKeys("2");
            influencerCampaign.submitProposalBtn.click();
            browser.sleep(2000);

            browser.getCurrentUrl().then(function(url) {
                expect(url).toContain('influencer-workroom');
            });
        });
    });
};

exports.gotoProfile = function () {
    it('Should have profile dropdown' , function() {
        expect(influencerHeaderPage.profileDropdownBtn.isPresent()).toBe(true);
        influencerHeaderPage.profileDropdownBtn.click();
    });
    it('Should have profile button' , function() {
        expect(influencerHeaderPage.profileBtn.isPresent()).toBe(true);
        influencerHeaderPage.profileBtn.click();
    });
    it('Should go profile page',function(){
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/influencer-profile');
        });
    });
};

exports.gotoSignUp = function() {
    it('Sign up link should exist',function(){
        expect(loginPage.signUpBtn.isPresent()).toBe(true);
        loginPage.clickSignUp();
    });
    it('Should go to sign up successful',function(){
        expect(influencerSignup.facebookBtn.isPresent()).toBe(true);
        expect(influencerSignup.youtubeBtn.isPresent()).toBe(true);
        expect(influencerSignup.emailBtn.isPresent()).toBe(true);
    });
    it('Should go to sign up by email', function(){
        influencerSignup.emailBtn.click();
    });
    it('Should go to sign up by email successful', function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/influencer-signup-email');
        });
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

exports.logout = function(){
    it('Should have dropdown header', function(){
        expect(influencerHeader.profileDropdownBtn.isPresent()).toBe(true);
        influencerHeader.profileDropdownBtn.click();
    });
    it('Should have sign out button', function(){
        expect(influencerHeader.signoutBtn.isPresent()).toBe(true);
        influencerHeader.signoutBtn.click();
    });
    it('Should logout success', function(){
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/influencer-login');
        });
    });
};

exports.editProfile = function(){
     var expectations = {
        about: chance.paragraph({ sentences: 1 }),
        name: 'Godamoto ' + chance.word({ syllables: 4 }),
        phone: "0811111211"
    };
    it('All input should exits', function(){
        expect(influencerProfile.about.isPresent()).toBe(true);
        expect(influencerProfile.name.isPresent()).toBe(true);
        expect(influencerProfile.uploader.isPresent()).toBe(true);
        expect(influencerProfile.submit_btn.isPresent()).toBe(true);
        expect(influencerProfile.phone.isPresent()).toBe(true);
        expect(influencerProfile.vertifiedName.isPresent()).toBe(true);
        expect(influencerProfile.vertifiedAddress.isPresent()).toBe(true);
        expect(influencerProfile.vertifiedCardNumber.isPresent()).toBe(true);
    });
    it('Should upload image', function(){
        var fileToUpload = 'god.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        influencerProfile.uploader.sendKeys(absolutePath);
    });
    it('Cropper should appear', function(){
        expect(influencerProfile.doneCropperBtn.isPresent()).toBe(true);
        influencerProfile.doneCropperBtn.click();
        browser.sleep(2000);
    });
    it('Should fill form', function(){
        influencerProfile.about.clear();
        influencerProfile.name.clear();
        influencerProfile.phone.clear();

        influencerProfile.about.sendKeys(expectations.about);
        influencerProfile.name.sendKeys(expectations.name);
        influencerProfile.phone.sendKeys(expectations.phone);
        influencerProfile.vertifiedName.sendKeys(expectations.name);
        influencerProfile.vertifiedAddress.sendKeys("Somewhere in Heaven");
        influencerProfile.vertifiedCardNumber.sendKeys("12121212121212");
    });
    it('Should click button save', function(){
        browser.sleep(1000);
        influencerProfile.submit_btn.click();
    });
    it('Should refresh page', function(){
        browser.driver.navigate().refresh();
    });
    it('Should save success', function() {
        expect(influencerProfile.thumbImage.isPresent()).toBe(true);
        expect(influencerProfile.about.getAttribute('value')).toEqual(expectations.about);
        expect(influencerProfile.name.getAttribute('value')).toEqual(expectations.name);
        expect(influencerProfile.phone.getAttribute('value')).toEqual(expectations.phone);
    });
};



exports.signUpEmail = function() {
   var user = {
      email: chance.email(),
      name: 'Godamoto ' + chance.word({ syllables: 4 }),
      phoneNumber: "0811111211",
      password: 'test1234'
  };
  it('should have all components', function() {
    expect(influencerSignup.name.isPresent()).toBe(true);
    expect(influencerSignup.email.isPresent()).toBe(true);
    expect(influencerSignup.phoneNumber.isPresent()).toBe(true);
    expect(influencerSignup.password.isPresent()).toBe(true);
    expect(influencerSignup.submitBtn.isPresent()).toBe(true);
  });
  it('should signup with email', function() {
    influencerSignup.name.sendKeys(user.name);
    influencerSignup.email.sendKeys(user.email);
    influencerSignup.phoneNumber.sendKeys(user.phoneNumber);
    influencerSignup.password.sendKeys(user.password);
    influencerSignup.submitBtn.click();
    browser.getCurrentUrl().then(function(url) {
      expect(url).toContain('influencer-profile-published');
    });
  });
};


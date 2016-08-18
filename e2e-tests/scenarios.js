'use strict';
var util = require('util');
var path = require('path');

describe('Brand', function () {

  beforeAll(function(){
    browser.params.brand_login.user =  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + browser.params.brand_login.user;
  });

  describe('Signup', function () {
    var state = {};
    beforeAll(function(){
      browser.get('portal.html#/brand-login');
    });

    it('can find inputs', function () {
      state.username = element(by.model('username'));
      state.password = element(by.model('password'));

      state.submit_btn = element(by.css('.btn-primary'));
      state.signup_btn = element(by.css('.signup-pill a'));

      expect(state.username.isPresent()).toBe(true);
      expect(state.password.isPresent()).toBe(true);
      expect(state.submit_btn.isPresent()).toBe(true);
      expect(state.signup_btn.isPresent()).toBe(true);
    });

    it('fails to login with bad credentials', function () {
      state.username.sendKeys("x" + browser.params.brand_login.user);
      state.password.sendKeys(browser.params.brand_login.password);
      state.submit_btn.click();

      expect($('.alert.alert-danger').isPresent()).toBe(true);
    });

    it('can find inputs', function () {
      state.signup_btn.click();

      browser.waitForAngular();

      state = {};

      state.brandName = element(by.model('formData.brand.brandName'));
      state.name = element(by.model('formData.name'));
      state.phoneNumber = element(by.model('formData.phoneNumber'));
      state.email = element(by.model('formData.email'));
      state.password = element(by.model('formData.password'));
      state.submit_btn = element(by.css('.btn-primary'));

      expect(state.brandName.isPresent()).toBe(true);
      expect(state.name.isPresent()).toBe(true);
      expect(state.phoneNumber.isPresent()).toBe(true);
      expect(state.email.isPresent()).toBe(true);
      expect(state.password.isPresent()).toBe(true);
      expect(state.submit_btn.isPresent()).toBe(true);
    });

    it('cannot signup without typing anything', function () {
      state.submit_btn.click();
      expect($('.alert.alert-danger').isPresent()).toBe(true);
    });

    it('can signup when form is complete', function () {
      state.brandName.sendKeys("Uniqlo");
      state.name.sendKeys("Fast Retailing Co Ltd");
      state.phoneNumber.sendKeys("0631459428");
      state.email.sendKeys(browser.params.brand_login.user);
      state.password.sendKeys(browser.params.brand_login.password);
      state.submit_btn.click();

      //redirection wait
      browser.sleep(2300);
      //angular load wait
      browser.waitForAngular();

      expect($('.alert.alert-info').isPresent()).toBe(true);
    });
  });

  describe('Login', function () {
    var state = {};
    beforeAll(function(){
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
      browser.get('portal.html#/brand-login');
    })

    it('can find inputs', function () {
      state.username = element(by.model('username'));
      state.password = element(by.model('password'));
      state.submit_btn = element(by.css('.btn-primary'));

      expect(state.username.isPresent()).toBe(true);
      expect(state.password.isPresent()).toBe(true);
      expect(state.submit_btn.isPresent()).toBe(true);
    });

    it('can login', function () {
      state.username.sendKeys(browser.params.brand_login.user);
      state.password.sendKeys(browser.params.brand_login.password);
      state.submit_btn.click();

      //redirection wait
      browser.sleep(2300);
      //angular load wait
      browser.waitForAngular();

      expect($('.alert.alert-info').isPresent()).toBe(true);
    });

  });

  describe('Save seeded draft campaign', function(){
    var state = {};
    beforeAll(function(){
      browser.get('brand.html#/brand-campaign-list');
    });

    it('can find sample draft campaign', function () {
      browser.waitForAngular();
      var cards = element.all(by.repeater("x in myCampaign.content"));
      expect(cards.count()).toEqual(1);
      cards.first().click();

    });

    it('can find inputs', function () {
      browser.waitForAngular();

      state.title = element(by.model('formData.title'));
      state.description = element(by.model('formData.description'));
      state.keyword = element(by.model('formData.keyword'));
      state.website = element(by.model('formData.website'));

      state.publish_btn = element(by.css('.btn-primary'));
      state.save_draft_btn = element(by.css('.btn-secondary'));
      state.uploaders = element.all(by.css('input[type="file"]'));

      //TODO: change to loop
      expect(state.title.isPresent()).toBe(true);
      expect(state.description.isPresent()).toBe(true);
      expect(state.keyword.isPresent()).toBe(true);
      expect(state.website.isPresent()).toBe(true);
      expect(state.publish_btn.isPresent()).toBe(true);
      expect(state.save_draft_btn.isPresent()).toBe(true);
      expect(state.uploaders.count()).toEqual(2);
    });

    it('can save as draft', function () {

      state.title.sendKeys("Edited first campaign");
      state.description.sendKeys("Established in 1944, Financial Executives Research Foundation (FERF) is the research affiliate of Financial Executives International (FEI). FERF is a non-profit, ...");
      state.keyword.sendKeys("yo, chinese, man");
      state.website.sendKeys("hey, china, ebola");

      var fileToUpload = 'cyanthumb.png';
      var absolutePath = path.resolve(__dirname, fileToUpload);
      state.uploaders.get(0).sendKeys(absolutePath);


      state.save_draft_btn.click();
      browser.waitForAngular();

      expect($('.alert.alert-success').isPresent()).toBe(true);
    });

    it('reloads and everything comes back', function () {
      browser.driver.navigate().refresh();
      browser.sleep(1000);
      var thumbImage = element(by.css(".card-image img"));
      expect(thumbImage.getAttribute('src') == 'images/placeholder-campaign.png').toBe(false);
    });

  });

  describe('Publish seeded draft campaign', function(){
    var state = {};
    beforeAll(function(){
      browser.get('brand.html#/brand-campaign-list');
    });

    it('can find sample draft campaign', function () {
      browser.waitForAngular();
      var cards = element.all(by.repeater("x in myCampaign.content"));
      expect(cards.count()).toEqual(1);
      cards.first().click();

    });

    it('can publish draft campaign', function () {

      state.publish_btn = element(by.css('.btn-primary'));

      browser.waitForAngular();
      state.publish_btn.click();
      browser.waitForAngular();
      // browser.pause();
      expect($('.alert.alert-success').isPresent()).toBe(true);
    });

  });


})

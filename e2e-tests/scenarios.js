'use strict';

  describe('brand login', function() {
    var state = {};
    browser.get('portal.html#/brand-login');

    beforeEach(function(){
      // browser.pause();
    });
    
    it('can find all the fields we need', function() {
      var username = element(by.model('username'));
      var password = element(by.model('password'));

      var submit_btn = element(by.css('.btn-primary'));
      var signup_btn = element(by.css('.signup-pill a'));

      expect(username.isPresent()).toBe(true);
      expect(password.isPresent()).toBe(true);
      expect(submit_btn.isPresent()).toBe(true);
      expect(signup_btn.isPresent()).toBe(true);

      state.username = username;
      state.password = password;
      state.submit_btn = submit_btn;
      state.signup_btn = signup_btn;
    });

    it('fails to login with bad credentials', function() {
      state.username.sendKeys("brand@brand.com");
      state.password.sendKeys("1111");
      state.submit_btn.click();
      
      expect($('.alert.alert-danger').isPresent()).toBe(true);
    });

    it('can click load signup form', function() {
      state.signup_btn.click();

      browser.waitForAngular();

      var brandName = element(by.model('formData.brand.brandName'));
      var name = element(by.model('formData.name'));
      var phoneNumber = element(by.model('formData.phoneNumber'));
      var email = element(by.model('formData.email'));
      var password = element(by.model('formData.password'));

      expect(brandName.isPresent()).toBe(true);
      expect(name.isPresent()).toBe(true);
      expect(phoneNumber.isPresent()).toBe(true);
      expect(email.isPresent()).toBe(true);
      expect(password.isPresent()).toBe(true);

      // browser.pause();
    });
    
  });



  xdescribe('influencer login', function() {

    beforeEach(function() {
      browser.get('portal.html#/influencer-portal');
    });
    
    it('should have 3 social buttons', function() {
      var elements = element.all(protractor.By.css('.btn-social'));
      expect(elements.count()).toEqual(3);
    });
    
    
  });



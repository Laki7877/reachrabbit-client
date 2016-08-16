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

      expect(username.isPresent()).toBe(true);
      expect(password.isPresent()).toBe(true);
      expect(submit_btn.isPresent()).toBe(true);

      state.username = username;
      state.password = password;
      state.submit_btn = submit_btn;
    });

    it('fails to login with bad credentials', function() {
      state.username.sendKeys("brand@brand.com");
      state.password.sendKeys("1111");
      state.submit_btn.click();
      
      expect($('.alert.alert-danger').isPresent()).toBe(true);
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



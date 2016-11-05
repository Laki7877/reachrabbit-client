var signup = require('../page_objects/influencerSignUpPage.js');
var common = require('./common.js');
var Chance = require('chance');
var chance = new Chance();

exports.signUpEmail = function() {
  it('should have all components', function() {
    expect(signup.name.isPresent()).toBe(true);
    expect(signup.email.isPresent()).toBe(true);
    expect(signup.phoneNumber.isPresent()).toBe(true);
    expect(signup.password.isPresent()).toBe(true);
    expect(signup.submitBtn.isPresent()).toBe(true);
  });
  it('should signup with email', function() {

  });
};

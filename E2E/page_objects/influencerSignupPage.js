var influencerSignUpPage = function () {
    'use strict';
    this.name = element(by.model('formData.name'));
    this.email = element(by.model('formData.email'));
    this.phoneNumber = element(by.model('formData.phoneNumber'));
    this.password = element(by.model('formData.password'));
    this.submitBtn = element(by.id('influencer-signup-submit-btn'));
    this.facebookBtn = element(by.css('.btn-social.btn-facebook.btn-width-max'));
    this.youtubeBtn = element(by.css('.btn-social.btn-google.btn-width-max'));
    this.emailBtn = element(by.css('.btn-secondary-highlight.btn-email.btn-width-max'));
    //******************** functions *******************//

};
module.exports = new influencerSignUpPage();

var influencerSignUpPage = function () {
    'use strict';
    this.name = element(by.model('formData.name'));
    this.email = element(by.model('formData.email'));
    this.phoneNumber = element(by.model('formData.phoneNumber'));
    this.password = element(by.model('formData.password'));
    this.submitBtn = element(by.id('influencer-signup-submit-btn'));

    //******************** functions *******************//

};
module.exports = new influencerSignUpPage();

var brandCampaignDetail = function () {
    'use strict';
    this.objectiveChoice = element(by.css('.btn-objective'));
    this.workType = element(by.css('.input-worktype'));
    this.facebookIcon = element(by.css('.checkbox .icon-facebook'));
    this.googleIcon = element(by.css('.checkbox .icon-google'));
    this.instagramIcon = element(by.css('.checkbox .icon-instagram'));
    this.description = element(by.model('formData.description'));
    this.website = element(by.model('formData.website'));
    this.budget = element(by.model("formData.budget"));
    this.publish_btn = element(by.css('.floating-bar .btn-primary'));
    this.save_draft_btn = element(by.css('.floating-bar .btn-secondary'));
    this.uploaders = element.all(by.css('input[type="file"]'));
    this.proposalDeadline = element(by.model("formData.proposalDeadline"));
    this.category = element(by.model('formData.category'));
    this.productName = element(by.model('formData.productName'));
    //******************** functions *******************//
};
module.exports = new brandCampaignDetail();
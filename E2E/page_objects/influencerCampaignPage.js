var influencerCampaignPage = function () {
    'use strict';
    this.YtCheckbox = element.all(by.css('.proposal-modal input[type=checkbox]:not([disabled])')).first();
    this.proposeBtn = element(by.id('influencer-campaign-detail-propose-btn'));
    this.submitProposalBtn = element(by.id('influencer-proposal-modal-submit-btn'));
    this.mediaCheckboxes = element(by.css('input[type=checkbox]'));
    this.completionTime = element(by.model('formData.completionTime'));
    this.price = element(by.model('formData.price'));
    this.description = element(by.model('formData.description'));
    //******************** functions *******************//
};
module.exports = new influencerCampaignPage();

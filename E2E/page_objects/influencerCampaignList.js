var influencerCampaignListPage = function () {
    'use strict';
    this.cards = element.all(by.repeater("cam in campaigns.content"));
    //******************** functions *******************//
};
module.exports = new influencerCampaignListPage();
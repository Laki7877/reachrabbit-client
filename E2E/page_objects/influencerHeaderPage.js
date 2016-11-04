var influencerHeaderPage = function () {
    'use strict';
    this.profileDropdownBtn = element(by.id('influencer-header-profile-dropdown'));
    this.profileBtn = element(by.id('influencer-header-profile'));
    this.payoutHistoryBtn = element(by.id('influencer-header-payout-history'));
    this.signoutBtn = element(by.id('influencer-header-signout'));
    this.campaignListBtn = element(by.id('influencer-header-influencer-campaign-list'));
    this.inboxSelectionBtn = element(by.id('influencer-header-influencer-inbox-selection'));
    this.inboxWorkingBtn = element(by.id('influencer-header-influencer-inbox-working'));
    this.inboxCompleteBtn = element(by.id('influencer-header-influencer-inbox-complete'));
    //******************** functions *******************//
    this.clickEditProfile = function() {
        this.profileDropdownBtn.click();
        this.profileBtn.click();
    };
    this.clickTransactionHistory = function() {
        this.profileDropdownBtn.click();
        this.payoutHistoryBtn.click();
    };
    this.clickSignout = function() {
        this.profileDropdownBtn.click();
        this.signoutBtn.click();
    };
    this.clickCampaignList = function() {
        this.campaignListBtn.click();
    };
    this.clickInboxSelection = function(){
        this.inboxSelectionBtn.click();
    };
    this.clickInboxWorking = function() {
        this.inboxWorkingBtn.click();
    };
    this.clickInboxComplete = function() {
        this.inboxCompleteBtn.click();
    };
};
module.exports = new influencerHeaderPage();

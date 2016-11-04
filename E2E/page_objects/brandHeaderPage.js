var brandHeaderPage = function () {
    'use strict';
    this.profileDropdownBtn = element(by.css('.id-brand-nav-profile-dropdown'));
    this.profileButton = element(by.css('.id-brand-nav-profile a'));
    this.brandTransactionHistoryBtn = element(by.css('.id-brand-nav-transaction-history a'));
    this.signoutBtn = element(by.css('.id-brand-nav-signout a'));
    this.campaignListBtn = element(by.id('brand-header-brand-campaign-list'));
    this.inboxSelectionBtn = element(by.id('brand-header-brand-inbox-selection'));
    this.cartBtn = element(by.id('brand-header-brand-cart'));
    this.inboxWorkingBtn = element(by.id('brand-header-brand-inbox-working'));
    this.inboxCompleteBtn = element(by.id('brand-header-brand-inbox-complete'));
    //******************** functions *******************//
    this.clickEditProfile = function() {
        this.profileDropdownBtn.click();
        this.profileButton.click();
    };
    this.clickTransactionHistory = function() {
        this.profileDropdownBtn.click();
        this.brandTransactionHistoryBtn.click();
    };
    this.clickSignout = function() {
        this.profileDropdownBtn.click();
        this.signoutBtn.click();
    };
    this.clickCampaignList = function() {
        this.campaignListBtn.click();
    };
    this.clickCart = function() {
        this.cartBtn.click();
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
module.exports = new brandHeaderPage();
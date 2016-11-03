var brandHeaderPage = function () {
    'use strict';
    this.profileDropdownBtn = element(by.css('.id-brand-nav-profile-dropdown'));
    this.profileButton = element(by.css('.id-brand-nav-profile a'));
    this.brandTransactionHistoryBtn = element(by.css('.id-brand-nav-transaction-history a'));
    this.signoutBtn = element(by.css('.id-brand-nav-signout a'));
    this.campaignListBtn = element(by.id('brand-header-brand-campaign-list'));
    
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
};
module.exports = new brandHeaderPage();
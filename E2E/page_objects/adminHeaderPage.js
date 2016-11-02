var adminHeaderPage = function () {
    'use strict';
    this.transactionHistoryBtn = element(by.id('admin-transaction-history-btn'));
    this.payoutHistoryBtn = element(by.id('admin-payout-history-btn'));
    this.campaignListBtn = element(by.id('admin-campaign-list-btn'));
    this.inboxBtn = element(by.id('admin-inbox-btn'));
    this.userListDropdownBtn = element(by.id('admin-user-dropdown-btn'));
    this.brandListBtn = element(by.id('admin-brand-list-btn'));
    this.influencerListBtn = element(by.id('admin-influencer-list-btn'));
    this.referralDropdownBtn = element(by.id('admin-referral-dropdown-btn'));
    this.referralCodeListBtn = element(by.id('admin-referral-code-list-btn'));
    this.referralPaymentListBtn = element(by.id('admin-referral-payment-list-btn'));
    this.profileDropdownBtn = element(by.id('admin-profile-dropdown-btn'));
    this.signoutBtn = element(by.id('admin-profile-signout-btn'));

    //******************** functions *******************//
    this.clickTransactionHistory = function() {
        this.transactionHistoryBtn.click();
    };
    this.clickPayoutHistory = function() {
        this.payoutHistoryBtn.click();
    };
    this.clickCampaignList = function() {
        this.campaignListBtn.click();
    };
    this.clickInbox = function() {
        this.inboxBtn.click();
    };
    this.clickBrandList = function() {
        this.userListDropdownBtn.click();
        this.brandListBtn.click();
    };
    this.clickInfluencerList = function() {
        this.userListDropdownBtn.click();
        this.influencerListBtn.click();
    };
    this.clickReferralCodeList = function() {
        this.referralDropdownBtn.click();
        this.referralCodeListBtn.click();
    };
    this.clickReferralPaymentList = function() {
        this.referralDropdownBtn.click();
        this.referralPaymentListBtn.click();
    };
    this.clickSignout = function() {
        this.profileDropdownBtn.click();
        this.signoutBtn.click();
    };
};
module.exports = new adminHeaderPage();

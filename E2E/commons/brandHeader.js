var brandHeaderPage = require('../page_objects/brandHeaderPage.js');

exports.gotoProfile = function () {
    it('Should have profile dropdown' , function() {
        expect(brandHeaderPage.profileDropdownBtn.isPresent()).toBe(true);
        brandHeaderPage.profileDropdownBtn.click();
    });
    it('Should have profile button' , function() {
        expect(brandHeaderPage.profileButton.isPresent()).toBe(true);
        brandHeaderPage.profileButton.click();
    });
    it('Should go profile page',function(){
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-profile');
        });
    });
};

exports.gotoCampaignList = function() {
    it('Button campaign list should exists', function(){
        expect(brandHeaderPage.campaignListBtn.isPresent()).toBe(true);
    });
    it('Should click campaign list button', function(){
        brandHeaderPage.clickCampaignList();
    });
    it('Should goto campaign list successful', function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};

exports.gotoCart = function() {
    it('Button cart should exists', function() {
        expect(brandHeader.cartBtn.isPresent()).toBe(true);
    });
    it('Should click cart button', function(){
        brandHeader.clickCart();
    });
    it('Should goto cart successful', function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-cart');
        });
    });
};
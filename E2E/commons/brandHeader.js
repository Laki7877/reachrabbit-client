var brandHeader = require('../page_objects/brandHeaderPage.js');

exports.gotoCampaignList = function() {
    it('Button campaign list should exists', function(){
        expect(brandHeader.campaignListBtn.isPresent()).toBe(true);
    });
    it('Should click campaign list button', function(){
        brandHeader.clickCampaignList();
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
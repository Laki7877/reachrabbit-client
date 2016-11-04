var brandHeader = require('../page_objects/brandHeaderPage.js');


exports.gotoCampaignList = function() {
    it('Button should exists', function(){
        expect(brandHeader.campaignListBtn.isPresent()).toBe(true);
    });
    it('Should click campaign list', function(){
        brandHeader.campaignListBtn.click();
    });
    it('Should goto campaign list successful', function(){
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/brand-campaign-list');
        });
    });
};
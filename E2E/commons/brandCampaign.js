var campaignList = require('../page_objects/brandCampaignListPage.js');


exports.gotoCreateCampaign = function(){
    it('New campaign button should exist',function(){
        expect(campaignList.newCampaignBtn.isPresent()).toBe(true);
    });
    it('Should click new campaign button',function(){
        campaignList.newCampaignBtn.click();
    });
};
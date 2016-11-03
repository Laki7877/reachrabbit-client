var campaignList = require('../page_objects/brandCampaignListPage.js');
var campaignDetail = require('../page_objects/brandCampaignDetailPage.js');
var Chance = require('chance');
var chance = new Chance();
var path = require('path');
var brandHeader = require('../page_objects/brandHeaderPage.js');


exports.gotoCreateCampaign = function(){
    it('New campaign button should exist',function(){
        expect(campaignList.newCampaignBtn.isPresent()).toBe(true);
    });
    it('Should click new campaign button',function(){
        campaignList.newCampaignBtn.click();
    });
};

exports.crateDraftCampaign = function() {
    it('Create new campaign component should exist',function(){
        browser.sleep(3000);
        browser.ignoreSynchronization = true;
        expect(campaignDetail.description.isPresent()).toBe(true);
        expect(campaignDetail.objectiveChoice.isPresent()).toBe(true);
        expect(campaignDetail.workType.isPresent()).toBe(true);
        expect(campaignDetail.website.isPresent()).toBe(true);
        expect(campaignDetail.budget.isPresent()).toBe(true);
        expect(campaignDetail.publish_btn.isPresent()).toBe(true);
        expect(campaignDetail.save_draft_btn.isPresent()).toBe(true);
        expect(campaignDetail.proposalDeadline.isPresent()).toBe(true);
        expect(campaignDetail.category.isPresent()).toBe(true);
        expect(campaignDetail.productName.isPresent()).toBe(true);
        expect(campaignDetail.uploaders.count()).toEqual(2);
        browser.ignoreSynchronization = false;
    });
    it('Should be able to fill campaign form', function(){
        var fileToUpload = 'cyanthumb.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        var campaignName = chance.name() + " " + chance.ssn({ dashes: false });;
        campaignDetail.objectiveChoice.click();
        campaignDetail.workType.click();
        campaignDetail.facebookIcon.click();
        campaignDetail.googleIcon.click();
        campaignDetail.instagramIcon.click();
        campaignDetail.description.sendKeys(chance.paragraph({ sentences: 5 }));
        campaignDetail.productName.sendKeys(campaignName);
        campaignDetail.category.sendKeys("แ");
        browser.sleep(1000);
        campaignDetail.uploaders.get(0).sendKeys(absolutePath);
        browser.sleep(1000);
        element(by.css('.done-crop-btn')).click();
        // state.uploaders.get(1).sendKeys(absolutePath);
        campaignDetail.website.sendKeys(chance.url());
        campaignDetail.budget.sendKeys("1");
        campaignDetail.proposalDeadline.click();
        browser.sleep(1000);
        element(by.css('.uib-right')).click();
        browser.sleep(1000);
        element.all(by.css(".uib-daypicker button")).get(28 + 2).click();
        browser.sleep(1000);
        campaignDetail.proposalDeadline.click();
        campaignDetail.save_draft_btn.click();
        browser.sleep(1000);
        expect($('.alert.alert-success').isPresent()).toBe(true);
        browser.sleep(2000);
        brandHeader.campaignListBtn.click();
        browser.sleep(2000);
    });
};
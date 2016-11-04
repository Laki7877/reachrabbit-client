var campaignList = require('../page_objects/brandCampaignListPage.js');
var campaignDraft = require('../page_objects/brandCampaignDraftPage.js');
var campaignDetail = require('../page_objects/brandCampaignDetailPage.js');
var Chance = require('chance');
var chance = new Chance();
var path = require('path');
var brandHeader = require('../page_objects/brandHeaderPage.js');

exports.hideRabbitModel = function() {
    it('Modal component should exist', function(){
        expect(campaignDetail.modalCampaignBtn.isPresent()).toBe(true);
        expect(campaignDetail.hideCheckbox.isPresent()).toBe(true);
    });
    it('Should click check box', function() {
        campaignDetail.hideCheckbox.click();
    });
    it('Should click modal button', function(){
        campaignDetail.modalCampaignBtn.click();
    });
};

exports.gotoCreateCampaign = function(){
    it('New campaign button should exist',function(){
        expect(campaignList.newCampaignBtn.isPresent()).toBe(true);
    });
    it('Should click new campaign button',function(){
        campaignList.newCampaignBtn.click();
    });
};

exports.publishCampaign = function() {
    it('Publish button should exist', function(){
        expect(campaignDraft.publish_btn.isPresent()).toBe(true);
    });
    it('Should click publish button', function(){
        campaignDraft.publish_btn.click();
    });
};

exports.crateDraftCampaign = function() {
    it('Create new campaign component should exist',function() {
        browser.ignoreSynchronization = true;
        expect(campaignDraft.description.isPresent()).toBe(true);
        expect(campaignDraft.objectiveChoice.isPresent()).toBe(true);
        expect(campaignDraft.workType.isPresent()).toBe(true);
        expect(campaignDraft.website.isPresent()).toBe(true);
        expect(campaignDraft.budget.isPresent()).toBe(true);
        expect(campaignDraft.save_draft_btn.isPresent()).toBe(true);
        expect(campaignDraft.proposalDeadline.isPresent()).toBe(true);
        expect(campaignDraft.category.isPresent()).toBe(true);
        expect(campaignDraft.productName.isPresent()).toBe(true);
        expect(campaignDraft.uploaders.count()).toEqual(2);
        browser.ignoreSynchronization = false;
    });
    it('Should be able to fill campaign form', function(){
        var fileToUpload = 'cyanthumb.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        var campaignName = chance.name() + " " + chance.ssn({ dashes: false });;
        campaignDraft.objectiveChoice.click();
        campaignDraft.workType.click();
        campaignDraft.facebookIcon.click();
        campaignDraft.googleIcon.click();
        campaignDraft.instagramIcon.click();
        campaignDraft.description.sendKeys(chance.paragraph({ sentences: 5 }));
        campaignDraft.productName.sendKeys(campaignName);
        campaignDraft.category.sendKeys("แ");
        campaignDraft.uploaders.get(0).sendKeys(absolutePath);
        campaignDraft.website.sendKeys(chance.url());
        campaignDraft.budget.sendKeys("0");
    });
    it('Should open croper',function(){
        browser.sleep(2000);
        campaignDraft.doneCropBtn.click();
    });
    it('Should open date picker', function(){
        campaignDraft.proposalDeadline.click();
    });
    it('Should click next month', function(){
        campaignDraft.nextMonthBtn.click();
    });
    it('Should pick up date', function(){
        campaignDraft.dateCalendar.get(28 + 2).click();
    });
    it('Should close date picker', function(){
        campaignDraft.proposalDeadline.click();
    });
    it('Should be able to click save draft', function(){
        campaignDraft.save_draft_btn.click();
    });
    it('Should save successful', function(){
        expect(campaignDraft.alert.isPresent()).toBe(true);
    });
};
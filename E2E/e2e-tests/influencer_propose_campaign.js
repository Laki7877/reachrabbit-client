var brand = require('../commons/brand.js'),
  influencer = require('../commons/influencer.js');

describe('Influencer propose campaign', function () {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
  });
  afterEach(function() {
    browser.sleep(1000);
  });
  // create a new campaign
  brand.gotoLogin();
  brand.loginSuccess();
  brand.gotoCreateCampaign();
  brand.createDraftCampaign();
  brand.publishCampaign();
  brand.hideRabbitModel();

  it('Should get to the right campaign', function() {
    browser.sleep(1000);
    browser.getCurrentUrl().then(function(url) {
      var token = url.split('/');
      browser.params.campaign.campaignId = token[token.length-1];
      expect(browser.params.campaign.campaignId).toBeDefined();
      expect(browser.params.campaign.campaignId).toBeGreaterThan(0);
      browser.sleep(3000);
      brand.logout();
    });
  });
  influencer.gotoLogin();
  influencer.loginSuccess();
  it('Should open campaign', function() {
       influencer.gotoCampaign(browser.params.campaign.campaignId);
  });
  influencer.proposeCampaign();
  influencer.logout();
  
});

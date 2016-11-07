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

  var id = 0;
  browser.getCurrentUrl().then(function(url) {
    var token = url.split('/');
    id = token[token.length-1];
  })
  .then(function() {
    brand.logout();
    influencer.
  });

});

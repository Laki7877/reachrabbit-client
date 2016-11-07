var influencerHeaderPage = require('../page_objects/influencerHeaderPage.js');

exports.gotoProfile = function () {
    it('Should have profile dropdown' , function() {
        expect(influencerHeaderPage.profileDropdownBtn.isPresent()).toBe(true);
        influencerHeaderPage.profileDropdownBtn.click();
    });
    it('Should have profile button' , function() {
        expect(influencerHeaderPage.profileBtn.isPresent()).toBe(true);
        influencerHeaderPage.profileBtn.click();
    });
    it('Should go profile page',function(){
        browser.sleep(1000);
        browser.getCurrentUrl().then(function(actualUrl){
            expect(actualUrl).toContain('#/influencer-profile');
        });
    });
};
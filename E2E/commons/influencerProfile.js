var influencerProfile = require('../page_objects/influencerProfilePage.js');
var Chance = require('chance');
var chance = new Chance();
var path = require('path');

exports.editProfile = function(){
     var expectations = {
        about: chance.paragraph({ sentences: 1 }),
        name: 'Godamoto ' + chance.word({ syllables: 4 }),
        phone: "0811111211"
    };
    it('All input should exits', function(){
        expect(influencerProfile.about.isPresent()).toBe(true);
        expect(influencerProfile.name.isPresent()).toBe(true);
        expect(influencerProfile.uploader.isPresent()).toBe(true);
        expect(influencerProfile.submit_btn.isPresent()).toBe(true);
        expect(influencerProfile.phone.isPresent()).toBe(true);
        expect(influencerProfile.vertifiedName.isPresent()).toBe(true);
        expect(influencerProfile.vertifiedAddress.isPresent()).toBe(true);
        expect(influencerProfile.vertifiedCardNumber.isPresent()).toBe(true);
    });
    it('Should upload image', function(){
        var fileToUpload = 'god.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        influencerProfile.uploader.sendKeys(absolutePath);
    });
    it('Cropper should appear', function(){
        expect(influencerProfile.doneCropperBtn.isPresent()).toBe(true);
        influencerProfile.doneCropperBtn.click();
        browser.sleep(2000);
    });
    it('Should fill form', function(){
        influencerProfile.about.clear();
        influencerProfile.name.clear();
        influencerProfile.phone.clear();

        influencerProfile.about.sendKeys(expectations.about);
        influencerProfile.name.sendKeys(expectations.name);
        influencerProfile.phone.sendKeys(expectations.phone);
        influencerProfile.vertifiedName.sendKeys(expectations.name);
        influencerProfile.vertifiedAddress.sendKeys("Somewhere in Heaven");
        influencerProfile.vertifiedCardNumber.sendKeys("12121212121212");
    });
    it('Should click button save', function(){
        browser.sleep(1000);
        influencerProfile.submit_btn.click();
    });
    it('Should refresh page', function(){
        browser.driver.navigate().refresh();
    });
    it('Should save success', function() {
        expect(influencerProfile.thumbImage.isPresent()).toBe(true);
        expect(influencerProfile.about.getAttribute('value')).toEqual(expectations.about);
        expect(influencerProfile.name.getAttribute('value')).toEqual(expectations.name);
        expect(influencerProfile.phone.getAttribute('value')).toEqual(expectations.phone);
    });
};


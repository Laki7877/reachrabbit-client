var brandProfile = require('../page_objects/brandProfilePage.js');
var Chance = require('chance');
var chance = new Chance();
var path = require('path');



exports.editProfile = function(){
     var expectations = {
        about: chance.paragraph({ sentences: 1 }),
        name: chance.word({ syllables: 4 }),
        website: chance.url()
    };
    it('All input should exits', function(){
        expect(brandProfile.about.isPresent()).toBe(true);
        expect(brandProfile.name.isPresent()).toBe(true);
        expect(brandProfile.website.isPresent()).toBe(true);
        expect(brandProfile.uploader.isPresent()).toBe(true);
        expect(brandProfile.submit_btn.isPresent()).toBe(true);
    });
    it('Should upload image', function(){
        var fileToUpload = 'greenthumb.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        brandProfile.uploader.sendKeys(absolutePath);
    });
    it('Cropper should appear', function(){
        expect(brandProfile.doneCropperBtn.isPresent()).toBe(true);
        brandProfile.doneCropperBtn.click();
        browser.sleep(2000);
    });
    it('Should fill form', function(){
        brandProfile.about.clear();
        brandProfile.name.clear();
        brandProfile.website.clear();
       
        brandProfile.about.sendKeys(expectations.about);
        brandProfile.name.sendKeys(expectations.name);
        brandProfile.website.sendKeys(expectations.website);
    });
    it('Should click button save', function(){
        browser.sleep(1000);
        brandProfile.submit_btn.click();
    });
    it('Should refresh page', function(){
        browser.driver.navigate().refresh();
    });
    it('Should save success', function() {
        expect(brandProfile.thumbImage.isPresent()).toBe(true);
        expect(brandProfile.about.getAttribute('value')).toEqual(expectations.about);
        expect(brandProfile.name.getAttribute('value')).toEqual(expectations.name);
        expect(brandProfile.website.getAttribute('value')).toEqual(expectations.website);
    });
};


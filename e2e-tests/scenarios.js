'use strict';
var util = require('util');
var path = require('path');
var Chance = require('chance');
var chance = new Chance();
describe('Brand', function() {

    beforeAll(function() {
        browser.params.brand_login.user = chance.email();
    });

    describe('Signup', function() {
        var state = {};
        beforeAll(function() {
            browser.get('portal.html#/brand-login');
        });

        it('can find inputs', function() {
            state.username = element(by.model('formData.username'));
            state.password = element(by.model('formData.password'));

            state.submit_btn = element(by.css('.btn-primary'));
            state.signup_btn = element(by.css('.signup-pill a'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
            expect(state.signup_btn.isPresent()).toBe(true);
        });

        it('fails to login with bad credentials', function() {
            state.username.sendKeys("x" + browser.params.brand_login.user);
            state.password.sendKeys(browser.params.brand_login.password);
            state.submit_btn.click();

            expect($('.alert.alert-danger').isPresent()).toBe(true);
        });

        it('can find inputs', function() {
            state.signup_btn.click();

            browser.waitForAngular();

            state = {};

            state.brandName = element(by.model('formData.brand.brandName'));
            state.name = element(by.model('formData.name'));
            state.phoneNumber = element(by.model('formData.phoneNumber'));
            state.email = element(by.model('formData.email'));
            state.password = element(by.model('formData.password'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.brandName.isPresent()).toBe(true);
            expect(state.name.isPresent()).toBe(true);
            expect(state.phoneNumber.isPresent()).toBe(true);
            expect(state.email.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
        });

        it('cannot signup without typing anything', function() {
            state.submit_btn.click();
            expect($('.alert.alert-danger').isPresent()).toBe(true);
        });

        it('can signup when form is complete', function() {
            state.name.sendKeys(chance.capitalize(chance.word({length:10})));
            state.brandName.sendKeys(chance.capitalize(chance.word({length:10})) + " Co Ltd");
            state.phoneNumber.sendKeys(chance.phone({ formatted: false }));
            state.email.sendKeys(browser.params.brand_login.user);
            state.password.sendKeys(browser.params.brand_login.password);
            state.submit_btn.click();

            //redirection wait
            browser.ignoreSynchronization = true;
            browser.sleep(2300);
            //angular load wait
            browser.waitForAngular();

            expect($('.alert.alert-info').isPresent()).toBe(true);
        });
    });

    describe('Login', function() {
        var state = {};
        beforeAll(function() {
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
            browser.get('portal.html#/brand-login');
        })

        it('can find inputs', function() {
            state.username = element(by.model('formData.username'));
            state.password = element(by.model('formData.password'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
        });

        it('can login', function() {
            state.username.sendKeys(browser.params.brand_login.user);
            state.password.sendKeys(browser.params.brand_login.password);
            state.submit_btn.click();

            browser.ignoreSynchronization = true;
            //redirection wait
            browser.sleep(2300);
            //angular load wait
            browser.waitForAngular();

            expect($('.alert.alert-info').isPresent()).toBe(true);
        });

    });

    describe('Modify seeded draft campaign', function() {
        var state = {};
        beforeAll(function() {
            browser.get('brand.html#/brand-campaign-list');
        });

        it('can find sample draft campaign', function() {
            browser.sleep(1000);
            var cards = element.all(by.repeater("x in myCampaign.content"));
            expect(cards.count()).toEqual(1);
            cards.first().click();
            
        });

        it('can find inputs', function() {
            browser.sleep(1000);

            state.title = element(by.model('formData.title'));
            state.description = element(by.model('formData.description'));
            state.keyword = element(by.model('formData.keyword'));
            state.website = element(by.model('formData.website'));
            state.budget = element(by.model("budget"));
            state.publish_btn = element(by.css('.btn-primary'));
            state.save_draft_btn = element(by.css('.btn-secondary'));
            state.uploaders = element.all(by.css('input[type="file"]'));
            state.proposalDeadline = element(by.model("formData.proposalDeadline"));
            state.category = element(by.model('formData.category'));

            expect(state.title.isPresent()).toBe(true);
            expect(state.description.isPresent()).toBe(true);
            expect(state.keyword.isPresent()).toBe(true);
            expect(state.website.isPresent()).toBe(true);
            expect(state.budget.isPresent()).toBe(true);
            expect(state.publish_btn.isPresent()).toBe(true);
            expect(state.save_draft_btn.isPresent()).toBe(true);
            expect(state.proposalDeadline.isPresent()).toBe(true);
            expect(state.category.isPresent()).toBe(true);
            expect(state.uploaders.count()).toEqual(2);

        });

        it('can save as draft', function() {
            state.title.clear();
            state.title.sendKeys(chance.name({ gender: "male" }));
            state.description.sendKeys(chance.paragraph({ sentences: 5 }));
            state.keyword.sendKeys(chance.city() + ", " + chance.city() + ", " + chance.city());
            state.website.sendKeys(chance.url());
            state.category.sendKeys("DIY");
            state.budget.sendKeys("5,000 - 10,000");
            state.proposalDeadline.click();

            //sslect date 12 of this month
            element.all(by.css(".uib-daypicker button")).get(12 + 2).click();

            var fileToUpload = 'cyanthumb.png';
            var absolutePath = path.resolve(__dirname, fileToUpload);
            state.uploaders.get(0).sendKeys(absolutePath);

            state.save_draft_btn.click();
            browser.sleep(1000);

            expect($('.alert.alert-success').isPresent()).toBe(true);
        });

        it('reloads and everything comes back', function() {
            browser.driver.navigate().refresh();
            browser.sleep(1000);
            var new_state = {};
            new_state.thumbImage = element(by.css(".card-image img"));

            new_state.title = element(by.model('formData.title'));
            new_state.description = element(by.model('formData.description'));
            new_state.keyword = element(by.model('formData.keyword'));
            new_state.website = element(by.model('formData.website'));
            new_state.budget = element(by.model("budget"));
            new_state.publish_btn = element(by.css('.btn-primary'));
            new_state.save_draft_btn = element(by.css('.btn-secondary'));
            new_state.uploaders = element.all(by.css('input[type="file"]'));
            new_state.proposalDeadline = element(by.model("formData.proposalDeadline"));
            new_state.category = element(by.model('formData.category'));

            expect(new_state.thumbImage.getAttribute('src') == 'images/placeholder-campaign.png').toBe(false);
            //TODO: check against valu we entered
            expect(new_state.category.$('option:checked').getText("DIY"));
            expect(new_state.budget.$('option:checked').getText("5,000 - 10,000"));
        });

    });

    describe('Modify and publish draft campaign', function() {
        var state = {};
        beforeAll(function() {
            browser.get('brand.html#/brand-campaign-list');
        });

        it('can find saved campaign', function() {
            browser.sleep(1000);
            var cards = element.all(by.repeater("x in myCampaign.content"));
            expect(cards.count()).toEqual(1);
            cards.first().click();
        });

        it('can publish drafted campaign', function() {
            browser.sleep(1000);
            state.publish_btn = element(by.css('.btn-primary'));

            expect(state.publish_btn.isPresent()).toBe(true);

            state.publish_btn.click();

            browser.sleep(1000);
            
            expect($('.alert.alert-success').isPresent()).toBe(true);
            // browser.pause();
        });

    });

    describe('Profile', function() {
        var state = {};
        beforeAll(function() {
            browser.get('brand.html#/brand-profile');
        });

        it('can find all fields', function() {
            browser.sleep(1000);
            state.about = element(by.model("formData.brand.about"));
            state.name = element(by.model("formData.brand.brandName"));
            state.website = element(by.model('formData.brand.website'));

            expect(state.about.isPresent()).toBe(true);
            expect(state.name.isPresent()).toBe(true);
            expect(state.website.isPresent()).toBe(true);

        });

        it('can save', function() {
            browser.sleep(1000);
        });

    });

});

describe('Influencer', function() {

});

describe('Chatting', function() {

});
'use strict';
var util = require('util');
var path = require('path');
var Chance = require('chance');
var chance = new Chance();
var EC = protractor.ExpectedConditions;

browser.driver.manage().window().setSize(1200, 800);

describe('Brand', function () {

    beforeAll(function () {
        browser.params.brand_login.user = chance.word({syllables: 4}) + chance.email({ domain: "reachrabbit.com",  });
    });

    describe('Signup', function () {
        var state = {};
        beforeAll(function () {
            browser.get('portal.html#/brand-login');
        });

        it('can find inputs', function () {
            state.username = element(by.model('formData.username'));
            state.password = element(by.model('formData.password'));

            state.submit_btn = element(by.css('.btn-primary'));
            state.signup_btn = element(by.css('.signup-pill a'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
            expect(state.signup_btn.isPresent()).toBe(true);
        });

        it('fails to login with bad credentials', function () {
            state.username.sendKeys("x" + browser.params.brand_login.user);
            state.password.sendKeys(browser.params.brand_login.password);
            state.submit_btn.click();

            expect($('.alert.alert-danger').isPresent()).toBe(true);
        });

        it('can find inputs', function () {
            state.signup_btn.click();

            // browser.waitForAngular();

            state = {};

            state.brandName = element(by.model('formData.brandName'));
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

        it('cannot signup without typing anything', function () {
            state.submit_btn.click();
            expect($('.alert.alert-danger').isPresent()).toBe(true);
        });

        it('can signup when form is complete', function () {
            state.name.sendKeys(chance.capitalize(chance.word({ length: 10 })));
            state.brandName.sendKeys(chance.capitalize(chance.word({ length: 10 })) + " Co Ltd");
            state.phoneNumber.sendKeys(chance.phone({ formatted: false }));
            state.email.sendKeys(browser.params.brand_login.user);
            state.password.sendKeys(browser.params.brand_login.password);
            state.password.sendKeys(protractor.Key.TAB);
            state.password.sendKeys(protractor.Key.ENTER);
            state.submit_btn.click();

            // browser.pause();

            //redirection wait
            // browser.ignoreSynchronization = true;

            browser.sleep(3000);

        });

    });

    describe('Login', function () {
        var state = {};
        beforeAll(function () {
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
            browser.get('portal.html#/brand-login');
        })

        it('can find inputs', function () {
            // browser.sleep(1000);
            // browser.waitForAngular();

            state.username = element(by.model('formData.username'));
            state.password = element(by.model('formData.password'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
        });

        it('can login', function () {
            state.username.sendKeys(browser.params.brand_login.user);
            state.password.sendKeys(browser.params.brand_login.password);

            browser.ignoreSynchronization = true;
            state.submit_btn.click();
            browser.ignoreSynchronization = false;

            browser.sleep(2000);
            // var info = element(by.css(".alert-info"));
            // expect(info.isPresent()).toBe(true);

        });

    });

    describe('Campaign', function () {
        var state = {};

        it('can find create campaign button', function () {
            // browser.waitForAngular();
            // var cards = element.all(by.repeater("x in exampleCampaign"));

            // expect(cards.count()).toEqual(2);
            // cards.first().click();

            var createBtn = element(by.css('.btn-primary'));
            expect(createBtn.isPresent()).toBe(true);
            createBtn.click();

        });

        it('can find inputs', function () {
            // browser.sleep(1000);
            // browser.waitForAngular();

            state.title = element(by.model('formData.title'));
            state.description = element(by.model('formData.description'));
            state.keyword = element(by.model('formData.keyword'));
            state.website = element(by.model('formData.website'));
            state.budget = element(by.model("formData.budget"));
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

        it('can save as draft', function () {

            var fileToUpload = 'cyanthumb.jpg';
            var absolutePath = path.resolve(__dirname, fileToUpload);
            var campaignName = chance.name() + " / " + chance.ssn({ dashes: false });;

            browser.params.campaignName = campaignName;

            state.uploaders.get(0).sendKeys(absolutePath);
            browser.sleep(2000);
            element(by.css('.done-crop-btn')).click();
            // state.uploaders.get(1).sendKeys(absolutePath);

            element(by.css('input[type=checkbox]')).click();

            state.title.clear();
            state.title.sendKeys(campaignName);
            state.description.sendKeys(chance.paragraph({ sentences: 5 }));
            state.keyword.sendKeys(chance.city() + ", " + chance.city() + ", " + chance.city());
            state.website.sendKeys(chance.url());
            state.category.sendKeys("แ");
            state.budget.sendKeys("1");
            state.proposalDeadline.click();

            //sslect date 12 of this month
            element(by.css('.uib-right')).click()
            browser.sleep(500)
            element.all(by.css(".uib-daypicker button")).get(28 + 2).click();

            state.title.sendKeys(protractor.Key.TAB);

            //wait for upload to finish
            state.save_draft_btn.click();

            expect($('.alert.alert-success').isPresent()).toBe(true);
        });

        it('everything echo back', function () {
            // browser.driver.navigate().refresh();
            var new_state = {};
            new_state.thumbImage = element(by.css(".card-image img"));

            new_state.title = element(by.model('formData.title'));
            new_state.description = element(by.model('formData.description'));
            new_state.keyword = element(by.model('formData.keyword'));
            new_state.website = element(by.model('formData.website'));
            new_state.budget = element(by.model("formData.budget"));
            new_state.publish_btn = element(by.css('.btn-primary'));
            new_state.save_draft_btn = element(by.css('.btn-secondary'));
            new_state.uploaders = element.all(by.css('input[type="file"]'));
            new_state.proposalDeadline = element(by.model("formData.proposalDeadline"));
            new_state.category = element(by.model('formData.category'));


            expect(new_state.thumbImage.getAttribute('src') == 'images/placeholder-campaign.png').toBe(false);
            //TODO: check against value we entered
            // expect(new_state.category.$('option:checked').getText("แ"));
            // expect(new_state.budget.$('option:checked').getText("5,000 - 10,000 บาท ต่อคน"));
            expect(new_state.title.getAttribute("value")).toEqual(browser.params.campaignName);
        });

    });

    describe('Modify and publish draft campaign', function () {
        var state = {};
        beforeAll(function () {
            browser.get('brand.html#/brand-campaign-list');
        });

        it('can find saved campaign', function () {
            var cards = element.all(by.repeater("x in myCampaign.content"));
            expect(cards.count()).toEqual(1);

            // Click button in the first campaign card
            element(by.css('.card-campaign-list-item:first-child button')).click();

        });

        it('can publish drafted campaign', function () {

            state.publish_btn = element(by.css('.btn-primary'));

            expect(state.publish_btn.isPresent()).toBe(true);

            state.publish_btn.click();

            //click on fat ass rabbit - "No i'm that that fat" Hello Rabbit
            var doNotShowBtn = element(by.css('.message-modal .checkbox input'));
            var continueBtn = element(by.css('.message-modal .btn-secondary-highlight'));
            doNotShowBtn.click();
            continueBtn.click();
            // browser.pause()

            expect($('.alert.alert-success').isPresent()).toBe(true);
        });

    });

    describe('Profile', function () {
        var state = {};
        beforeAll(function () {
            browser.get('brand.html#/brand-profile');
        });

        it('(view) can find all fields', function () {
            // browser.sleep(1000);
            state.about = element(by.model("formData.brand.about"));
            state.name = element(by.model("formData.brand.brandName"));
            state.website = element(by.model('formData.brand.website'));
            state.uploader = element(by.css('input[type="file"]'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.about.isPresent()).toBe(true);
            expect(state.name.isPresent()).toBe(true);
            expect(state.website.isPresent()).toBe(true);
            expect(state.uploader.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);

        });

        it('(edit) can save basic information', function () {
            var fileToUpload = 'greenthumb.jpg';
            var absolutePath = path.resolve(__dirname, fileToUpload);

            var expectations = {
                about: chance.paragraph({ sentences: 1 }),
                name: chance.word({ syllables: 4 }),
                website: chance.url()
            };

            state.uploader.sendKeys(absolutePath);
            browser.sleep(2000);
            element(by.css('.done-crop-btn')).click();

            state.about.clear();
            state.name.clear();
            state.website.clear();

            state.about.sendKeys(expectations.about);
            state.name.sendKeys(expectations.name);
            state.website.sendKeys(expectations.website);

            state.submit_btn.click();

            browser.sleep(1000);

            browser.driver.navigate().refresh();

            var _about = element(by.model("formData.brand.about"));
            var _name = element(by.model("formData.brand.brandName"));
            var _website = element(by.model('formData.brand.website'));

            browser.sleep(1000);

            //Back checking
            var thumbImage = element(by.css('.input-upload-image img'));
            expect(thumbImage.isPresent()).toBe(true);

            expect(_about.getAttribute('value')).toEqual(expectations.about);
            expect(_name.getAttribute('value')).toEqual(expectations.name);
            expect(_website.getAttribute('value')).toEqual(expectations.website);
        });

    });

});

describe('Influencer', function () {
    var state = {};

    describe('God Login', function () {
        beforeAll(function () {
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
            browser.get('portal.html#/influencer-god-login');
        });

        it('can find inputs', function () {

            state.username = element(by.model('username'));
            state.password = element(by.model('password'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
        });

        it('can login', function () {
            state.username.clear();
            state.password.clear();
            state.username.sendKeys(browser.params.god_influencer.user);
            state.password.sendKeys(browser.params.god_influencer.password);
            browser.ignoreSynchronization = true;
            state.submit_btn.click();
            browser.ignoreSynchronization = false;

            browser.sleep(1500);

            var campaignRepeater = element.all(by.repeater("cam in campaigns.content"));
            campaignRepeater.count().then(function (ct) {
                expect(ct >= 1).toBeTruthy();
            });

        });


    });

    describe('God profile', function () {
        beforeAll(function () {
            browser.get('influencer.html#/influencer-profile');
        });

        it('(view) can find all fields', function () {
            state.name = element(by.model("formData.name"));
            state.about = element(by.model('formData.influencer.about'));
            state.phone = element(by.model('formData.phoneNumber'));

            state.uploader = element(by.css('input[type="file"]'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.about.isPresent()).toBe(true);
            expect(state.name.isPresent()).toBe(true);
            expect(state.uploader.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
            expect(state.phone.isPresent()).toBe(true);

        });

        it('(edit) can save basic information', function () {
            var fileToUpload = 'god.jpg';
            var absolutePath = path.resolve(__dirname, fileToUpload);

            var expectations = {
                about: chance.paragraph({ sentences: 1 }),
                name: 'Godamoto ' + chance.word({ syllables: 4 }),
                phone: "0811111211"
            };

            state.uploader.sendKeys(absolutePath);
            browser.sleep(2000);
            element(by.css('.done-crop-btn')).click();

            state.about.clear();
            state.name.clear();
            state.phone.clear();

            state.about.sendKeys(expectations.about);
            state.name.sendKeys(expectations.name);
            state.phone.sendKeys(expectations.phone);

            state.submit_btn.click();

            browser.sleep(1000);

            browser.driver.navigate().refresh();

            browser.sleep(1000);

            var _about = element(by.model("formData.influencer.about"));
            var _name = element(by.model("formData.name"));
            var _phone = element(by.model("formData.phoneNumber"));
            browser.sleep(1000);

            //Back checking
            var thumbImage = element(by.css('.input-upload-image img'));
            expect(thumbImage.isPresent()).toBe(true);
            expect(_about.getAttribute('value')).toEqual(expectations.about);
            expect(_name.getAttribute('value')).toEqual(expectations.name);
            expect(_phone.getAttribute('value')).toEqual(expectations.phone);


        });


        xit('can connect with Instagram', function () {
            var igbtn = element.all(by.css('.btn-secondary.btn-width-lg')).last();
            igbtn.click();

            browser.sleep(1000);
            browser.getAllWindowHandles().then(function (handles) {
                // switch to the popup
                browser.switchTo().window(handles[1]);
                browser.pause();

                // go back to the main window
                browser.switchTo().window(handles[0]);
            });


        });

    });

    describe('Can see campaigns detail', function () {
        beforeAll(function () {
            browser.get('influencer.html#/influencer-campaign-list');
        });

        it('can see open campaigns', function () {
            var cards = element.all(by.repeater("cam in campaigns.content"));
            cards.count().then(function (ct) {
                expect(ct >= 1).toBeTruthy();
            });
            cards.first().click();
        });

        xit('can see campaign detail with correct data', function () {
            //TODO:  need to refactor this test for a more "connected" testcase
            //eg. we check that campaign created by brand exist and can be seen by influencer
            element(by.css('.page-header h1')).getText(function (text) {
                console.log("Title is", text);
            });
            expect(element(by.css('.page-header h1')).getText()).toEqual(browser.params.campaignName);
        });
    })

});

describe('Influencer-Brand interaction', function () {
    it('Influencer can apply to campaign (submit proposal)', function () {
        var applyBtn = element(by.css(".page-header button"));
        expect(applyBtn.isPresent()).toBe(true);

        applyBtn.click();

        var YtCheckbox = element.all(by.css('.proposal-modal input[type=checkbox]:not([disabled])')).first();
        var completionTime = element(by.model('formData.completionTime'));
        var price = element(by.model('formData.price'));
        var description = element(by.model('formData.description'));

        expect(YtCheckbox.isPresent()).toBe(true);
        expect(completionTime.isPresent()).toBe(true);
        expect(price.isPresent()).toBe(true);
        expect(description.isPresent()).toBe(true);

        var proposedPrice = chance.integer({ min: 2000, max: 100000 });

        // //TODO: Check that calculated 0.82* proposedPrice appears.
        // //need model or some identifier
        YtCheckbox.click().then(function () {
            description.sendKeys(chance.paragraph({ sentences: 5 }));
            price.sendKeys(proposedPrice);
            completionTime.sendKeys("2");

            var sendbtn = element(by.css('.proposal-modal .btn-primary:not([disabled])'));
            expect(sendbtn.isPresent()).toBe(true);

            sendbtn.click();
            browser.sleep(1000);
        });

    });

    it('Influencer is taken to workroom and can close message modal', function () {
        var doNotShowBtn = element(by.css('.message-modal .checkbox input'));
        var continueBtn = element(by.css('.message-modal .btn-secondary-highlight'));
        doNotShowBtn.click();
        continueBtn.click();
        expect(element(by.css('.chatbox-card')).isPresent()).toBe(true);
    });

    xit('Influencer workroom shows correct info', function () {

    });

    it('Influencer can send message', function () {
        browser.ignoreSynchronization = true;
        var textarea = element(by.model('formData.messageStr'));
        var sendBtn = element(by.css('.btn-secondary-highlight'));
        expect(textarea.isPresent()).toBe(true);
        expect(sendBtn.isPresent()).toBe(true);

        textarea.sendKeys('Hello');
        sendBtn.click();

        browser.sleep(1000);

        //check that it appears
        var messages = element.all(by.repeater('x in msglist'));
        expect(messages.count()).toEqual(2);
        expect(messages.get(1).element(by.css('.message-content')).getText()).toEqual('Hello');
        browser.ignoreSynchronization = false;
    });

    xit('Influencer can send message with images attached');

    it('Brand can see the message sent by influencer', function () {

        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        browser.get('portal.html#/brand-login');

        var username = element(by.model('formData.username'));
        var password = element(by.model('formData.password'));
        var submit_btn = element(by.css('.btn-primary'));

        expect(username.isPresent()).toBe(true);
        expect(password.isPresent()).toBe(true);
        expect(submit_btn.isPresent()).toBe(true);

        username.sendKeys(browser.params.brand_login.user);
        password.sendKeys(browser.params.brand_login.password);
        browser.ignoreSynchronization = true;
        submit_btn.click();
        browser.sleep(2000);
        browser.ignoreSynchronization = false;

        browser.get('brand.html#/brand-inbox/');

        var latestProposal = element.all(by.repeater('proposal in proposals.content')).first();
        expect(latestProposal.isPresent()).toBe(true);
        latestProposal.element(by.css('.btn-secondary')).click();

        // browser.pause();
        //check that inf message appears
        var messages = element.all(by.repeater('x in msglist'));
        expect(messages.count()).toEqual(2);
        expect(messages.get(1).element(by.css('.message-content')).getText()).toEqual('Hello');

    });

});

describe('Brand can add influencer to cart', function () {
    it('can can choose proposal', function () {
        var chooseProposalBtn = element(by.css('.btn-primary'));
        chooseProposalBtn.click();
    });

    it('has cart of size 1', function () {

        var cartList = element.all(by.repeater('proposal in cart.proposals'));
        expect(cartList.count()).toEqual(1);

    });

    xit('has correct cart fee sum');

    it('can can checkout', function () {
        var checkoutBtn = element(by.css('.btn-primary'));
        checkoutBtn.click();
    });

    it('can see brand-transaction-detail', function () {
        var transactionNumber = element(by.binding('transaction.transactionNumber'));

        transactionNumber.getText().then(function (text) {
            browser.params.transactionNumber = text;
            expect(transactionNumber.isPresent()).toBe(true);
        });

    });

});

describe('Admin can approve payment', function () {
    beforeAll(function () {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        browser.get('portal.html#/admin-login');

        var username = element(by.model('formData.username'));
        var password = element(by.model('formData.password'));
        var submit_btn = element(by.css('.btn-primary'));

        username.sendKeys(browser.params.admin_login.user);
        password.sendKeys(browser.params.admin_login.password);

        submit_btn.click();
        browser.sleep(1000);
    });

    it('can find transaction history', function () {
        element.all(by.repeater('transaction in transactions.content')).count().then(function (ct) {
            expect(ct).toBeGreaterThan(0);
        });
    });

    it('can approve payment from brand', function () {
        var transactionList = element.all(by.repeater('transaction in transactions.content'));
        var transactionNumber = transactionList.get(0).element(by.binding('transaction.transactionNumber'));
        var detailBtn = transactionList.get(0).element(by.css('.btn-secondary'));

        expect(transactionNumber.getText()).toEqual(browser.params.transactionNumber);
        detailBtn.click();

        var btnApproveBtn = element(by.css('.btn-primary'));
        btnApproveBtn.click();

        expect(element(by.css('.color-green .fa-check-circle-o')).isPresent()).toBe(true)
    });

});

describe('Brand can approve work', function () {
    it('Brand approve work', function () {

        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        browser.get('portal.html#/brand-login');

        var username = element(by.model('formData.username'));
        var password = element(by.model('formData.password'));
        var submit_btn = element(by.css('.btn-primary'));

        expect(username.isPresent()).toBe(true);
        expect(password.isPresent()).toBe(true);
        expect(submit_btn.isPresent()).toBe(true);

        username.sendKeys(browser.params.brand_login.user);
        password.sendKeys(browser.params.brand_login.password);
        browser.ignoreSynchronization = true;
        submit_btn.click();
        browser.sleep(2000);
        browser.ignoreSynchronization = false;

        browser.get('brand.html#/brand-inbox/Working');

        var latestProposal = element.all(by.repeater('proposal in proposals.content')).first();
        expect(latestProposal.isPresent()).toBe(true);
        latestProposal.element(by.css('.btn-secondary')).click();

        //click on approve button
        element(by.css('.btn-primary')).click();

        browser.sleep(1000);

        //modal confirm
        element(by.css('.btn-primary')).click();

        browser.sleep(1000);

    });

});

describe('Influencer Payment', function () {

    describe('God Login', function () {
        var state = {};
        beforeAll(function () {
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
            browser.get('portal.html#/influencer-god-login');
        });

        it('can find inputs', function () {

            state.username = element(by.model('username'));
            state.password = element(by.model('password'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
        });

        it('can login', function () {
            state.username.clear();
            state.password.clear();
            state.username.sendKeys(browser.params.god_influencer.user);
            state.password.sendKeys(browser.params.god_influencer.password);
            browser.ignoreSynchronization = true;
            state.submit_btn.click();
            browser.ignoreSynchronization = false;

            browser.sleep(1500);

            var campaignRepeater = element.all(by.repeater("cam in campaigns.content"));
            campaignRepeater.count().then(function (ct) {
                expect(ct >= 1).toBeTruthy();
            });

        });


    });

    it('can click on wallet in top bar', function () {
        var walletBtn = element(by.css('.wallet'));
        walletBtn.click();

        element(by.model('formData.bank')).sendKeys('ธ');
        element(by.model('formData.accountNumber')).sendKeys('1444000010100');
        element(by.model('formData.accountName')).sendKeys('Sample Account');
    });

    it('can request payout', function () {
        element(by.css('.btn-primary')).click();
        browser.sleep(1500);
    });
});

describe('Admin Payment', function () {

    beforeAll(function () {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        browser.get('portal.html#/admin-login');

        var username = element(by.model('formData.username'));
        var password = element(by.model('formData.password'));
        var submit_btn = element(by.css('.btn-primary'));

        username.sendKeys(browser.params.admin_login.user);
        password.sendKeys(browser.params.admin_login.password);

        submit_btn.click();

        browser.sleep(1000);
    });

    it('can find payouts', function () {
        browser.get('admin.html#/admin-payout-history');
        element.all(by.repeater('transaction in transactions.content')).count().then(function (ct) {
            expect(ct).toBeGreaterThan(0);
        });
    });

    it('can confirm payout', function () {
        var latestTrans = element.all(by.repeater('transaction in transactions.content')).first();
        latestTrans.element(by.css('.btn-secondary')).click();

        var uploader = element(by.css('input[type="file"]'));

        var fileToUpload = 'cyanthumb.jpg';
        var absolutePath = path.resolve(__dirname, fileToUpload);
        uploader.sendKeys(absolutePath);

        element(by.css('.btn-primary')).click();
        browser.sleep(1000);
    });
});

describe('Influencer', function () {
    describe('God Login', function () {
        var state = {};
        beforeAll(function () {
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
            browser.get('portal.html#/influencer-god-login');
        });

        it('can find inputs', function () {

            state.username = element(by.model('username'));
            state.password = element(by.model('password'));
            state.submit_btn = element(by.css('.btn-primary'));

            expect(state.username.isPresent()).toBe(true);
            expect(state.password.isPresent()).toBe(true);
            expect(state.submit_btn.isPresent()).toBe(true);
        });

        it('can login', function () {
            state.username.clear();
            state.password.clear();
            state.username.sendKeys(browser.params.god_influencer.user);
            state.password.sendKeys(browser.params.god_influencer.password);
            browser.ignoreSynchronization = true;
            state.submit_btn.click();
            browser.ignoreSynchronization = false;

            browser.sleep(1500);
        });


    });

    it('can see status change and payment slip', function () {
        browser.get('influencer.html#/influencer-payout-history');

        element.all(by.repeater('transaction in transactions.content')).count().then(function (ct) {
            expect(ct).toBeGreaterThan(0);
        });

        var latestPayout = element.all(by.repeater('transaction in transactions.content')).first();

        //check status is correct
        var greenStatus = latestPayout.element(by.css('.color-green'));
        expect(greenStatus.isPresent()).toBe(true);

        //click on it
        latestPayout.element(by.css('.btn-secondary')).click();
        //check slip is there
        var prollySlip = element(by.css("table img"));
        expect(prollySlip.isPresent()).toBe(true);

    });
});

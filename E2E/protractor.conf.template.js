//jshint strict: false
exports.config = {

    allScriptsTimeout: 120000,

    specs: [
        //<FILE>//
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    params: {
        brand_login: {
            user: '<brandEmail>',
            password: '<brandPassword>'
        },
        admin_login: {
            user: '<adminEmail>',
            password: '<adminPassword>'
        },
        influencer_login: {
            user: '<influencerEmail>',
            password: '<influencerPassword>'
        },
        god_influencer: {
            user: 'influencer@reachrabbit.com',
            password: 'test1234'
        },
        facebook_login: {
            user: 'robot_txcbvac_ng@tfbnw.net',
            password: 'Ahancer123!'
        },
        ig_login: {
            user: 'eastduckman',
            password: 'Ahancer123!'
        },
        admin_login: {
            user: 'admin@reachrabbit.com',
            password: 'test1234'
        },
        campaign: {
            campaignId: 0
        }
    },

    resultJsonOutputFile: 'test_result/test-report.json',
    baseUrl: 'https://localhost/',
    framework: 'jasmine',
    onPrepare: function() {
        var SpecReporter = require('jasmine-spec-reporter');
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: 'none', displaySpecDuration: true }));
        jasmine.getEnv().addReporter({
            specDone: function (spec) {
                if (spec.status === 'failed' || spec.failedExpectations.length > 0) {
                    // console.dir(spec.failedExpectations.length);
                    console.log(spec.failedExpectations[0].message);
                    // console.log(spec.failedExpectations[0].stack);
                    // browser.pause();
                }
            }
        });


    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 50000,
        isVerbose: true,
        includeStackTrace: true
    }

};
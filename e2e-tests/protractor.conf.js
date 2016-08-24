//jshint strict: false
exports.config = {

    allScriptsTimeout: 199000,

    specs: [
        '*.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    params: {
        brand_login: {
            user: 'uniqlo@brands.org',
            password: 'test11121'
        },
        jesus_influencer_login: {
            user: 'influencer@gmail.com',
            password: 'test12324'
        }
    },

    resultJsonOutputFile: 'test-report.json',

    baseUrl: 'http://localhost:8080/',

    framework: 'jasmine',
    onPrepare: function() {
        var SpecReporter = require('jasmine-spec-reporter');
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: 'none', displaySpecDuration: true }));
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 199000,
        isVerbose: true,
        includeStackTrace: true
    }

};
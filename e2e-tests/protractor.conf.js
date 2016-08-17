//jshint strict: false
exports.config = {

  allScriptsTimeout: 95000,

  specs: [
    '*.js'
  ],
  
  capabilities: {
    'browserName': 'chrome'
  },
  
  params: {
    brand_login: {
      user: 'uniqlo@brands.org',
      password: '1111'
    }
  },

  resultJsonOutputFile: 'test-report.json',
  
  baseUrl: 'http://localhost:8080/',

  framework: 'jasmine',
   onPrepare: function() {
      var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter
      jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'none', displaySpecDuration: true}));
   },
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 90000,
    isVerbose : true,
    includeStackTrace : true
  }

};

//jshint strict: false
exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],
  
  capabilities: {
    'browserName': 'chrome'
  },
  
  params: {
    facebook_login: {
      user: 'Jane',
      password: '1234'
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
    defaultTimeoutInterval: 30000,
    isVerbose : true,
    includeStackTrace : true
  }

};

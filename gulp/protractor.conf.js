var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
  seleniumServerJar: 'selenium-server-standalone-2.47.1.jar',
  chromeDriver: 'chromedriver.exe',
  //specs: ['../source/test/e2e/**/*.spec.js'],
  suites: {
        mainPage: '../source/test/e2e/specs/mainPage.spec.js'
      },
  baseUrl: 'http://localhost:9020/index.html',
  jasmineNodeOpts: {defaultTimeoutInterval: 1200000},
  params: require('../source/test/e2e/testData/testdata.json'),
  multiCapabilities: [{
    browserName: 'chrome',
    'chromeOptions': {
      'args': ['--disable-extensions', '--start-maximized']
    }
  }],
  onPrepare: function() {
    global.isAngularSite = function(flag) {
      browser.ignoreSynchronization = !flag;
   };

    jasmine.getEnv().addReporter(new ScreenShotReporter({
      baseDirectory: 'screenshots',
      takeScreenShotsOnlyForFailedSpecs: true
    }));

    setTimeout(function() {
      browser.driver.executeScript(function() {
        return {
            width: 1024,
            height: 768
        };
      }).then(function(result) {
        // browser.driver.manage().window().setSize(result.width, result.height);
        //browser.driver.manage().window().maximize();
      });
    });
  }
};

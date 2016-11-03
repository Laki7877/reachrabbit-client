

exports.hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
};

exports.waitForCurrentUrl = function() {
    var timeout = 10000;
    return browser.driver.wait(function() {
        // Return a condition. Code will continue to run until is true
        return browser.driver.getCurrentUrl().then(function(url) {
            return url;
        }, function(err) {
            // errored  .. TODO: retry
            throw err;
        });
    }, timeout, 'Expectation error: Timed out waiting for current url');
};

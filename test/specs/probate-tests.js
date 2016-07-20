var assert = require('assert');

describe('probate welcome page', function() {
  it('should display the welcome page', function () {
    browser.url('http://localhost:3000');
    var title = browser.getTitle();
    assert.equal(title, 'Welcome');
  });
});
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('ieecloud-editor', function() {


  it('should automatically redirect to /editor when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/editor");
  });


  describe('editor', function() {

    beforeEach(function() {
      browser.get('index.html#/editor');
    });


    it('should render editor when user navigates to /editor', function() {
      expect(element.all(by.css('[ui-view] p')).first().getText()).
        toMatch(/partial for editor/);
    });

  });
});

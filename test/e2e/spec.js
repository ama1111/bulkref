describe('bulkref suite', function() {
  it('should pass this test', function() {

    var searchTerm = 'Direct medical cost of managing IBD patients: a Canadian population-based study.';
    var expectedDoi = '10.1002/ibd.21878';

    browser.get('http://localhost:3000/');

    element(by.model('names')).sendKeys(searchTerm);

    element(by.id('btn-start')).click();

    browser.waitForAngular().then(function (v){
      var results = element.all(by.repeater('result in results'));
      expect(results.count()).toEqual(1);

      expect(results.first().element(by.css('.list-group-item-text')).getText())
      .toContain(expectedDoi);
    });


  });
});

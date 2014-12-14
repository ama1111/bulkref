describe('bulkref suite', function() {
  it('should find a doi', function() {

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

  it('should find multiple dois', function() {

    var searchTerms = [
      'Isotretinoin is not associated with inflammatory bowel disease: a population-based case-control study.',
      'Corrigendum: Isotretinoin Is Not Associated With Inflammatory Bowel Disease: A Population-Based Case–Control Study',
      'The Burden of Inflammatory Bowel Disease (IBD) in Canada'
    ];
    var expectedDois = [
      '10.1016/s0739-5930(10)79464-2',
      '10.1038/ajg.2009.526',
      '10.1097/01.mib.0000438923.81005.ad'
    ];

    browser.get('http://localhost:3000/');

    element(by.model('names')).sendKeys(searchTerms.join('\n'));

    element(by.id('btn-start')).click();

    browser.waitForAngular().then(function (v){
      var results = element.all(by.repeater('result in results'));
      expect(results.count()).toEqual(3);

      var i = 0;
      results.each(function(result){
        expect(result.element(by.css('.list-group-item-text')).getText()).toContain(expectedDois[i]);

        i++;
      });
    });


  });
});

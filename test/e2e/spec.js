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

  it('should show "Did not find match"', function() {

    var searchTerms = [
    'WHAT CAN ROLLING REGRESSIONS TELL US ABOUT SYSTEMATIC RISK?',
    'Work losses related to inflammatory bowel disease in Canada: results from a National Population Health Survey.'
    ];
    var expectedDoi = '10.1111/j.1572-0241.2003.07378.x';

    browser.get('http://localhost:3000/');

    element(by.model('names')).sendKeys(searchTerms.join('\n'));

    element(by.id('btn-start')).click();

    browser.waitForAngular().then(function (v){
      var results = element.all(by.repeater('result in results'));
      expect(results.count()).toEqual(2);

      expect(results.first().element(by.id('error-text-0')).getText())
      .toEqual('Didn\'t find match.');

      expect(results.last().element(by.css('.list-group-item-text')).getText())
      .toContain(expectedDoi);
    });
  });

  it('should add doi when approve clicked', function() {

    var searchTerms = [
    'Lifetime costs for medical services: a methodological review.',
    'The effect of renal insufficiency on workforce participation in the United States: an analysis using National Health and Nutrition Examination Survey III data.'
    ];
    var expectedDois = [
    '10.1017/s0266462303000254',
    '10.1053/ajkd.2002.36854'
    ].join('\n');

    browser.get('http://localhost:3000/');

    element(by.model('names')).sendKeys(searchTerms.join('\n'));

    element(by.id('btn-start')).click();

    browser.waitForAngular().then(function (v){
      var results = element.all(by.repeater('result in results'));
      expect(results.count()).toEqual(2);

      element(by.id('btn-approve-0')).click().then(function(){

        element(by.id('btn-approve-1')).click().then(function(){
          expect(element(by.id('doi-area')).getAttribute('value')).toEqual(expectedDois);
        });

      });
    });
  });

  it('should show "Found an entry but not citation"', function() {

    var searchTerms = [
    'Children in the information technology design process: A review of theories and their applications',
    'Bonded design: A methodology for designing with children'
    ];
    var expectedDoi = '10.1016/j.lisr.2003.12.002';

    browser.get('http://localhost:3000/');

    element(by.model('names')).sendKeys(searchTerms.join('\n'));

    element(by.id('btn-start')).click();

    browser.waitForAngular().then(function (v){
      var results = element.all(by.repeater('result in results'));
      expect(results.count()).toEqual(2);

      expect(results.first().element(by.css('.list-group-item-text')).getText())
      .toContain(expectedDoi);

      expect(results.last().element(by.id('error-text-1')).getText())
      .toContain('Found an entry in CrossRef but did not find the citation on doi.org.');

    });
  });
});

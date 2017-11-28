var express = require('express');
var app = express();
// Using needle because 'request' doesn't allow raw form data.
var needle = require('needle');
var bodyParser = require('body-parser');
// Using request because needle doesn't follow redirects.
var request = require('request');

app.set('port', (process.env.PORT || 3000));

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/links', function (req, res) {
  res.json({ message: 'message from links!' });
});

app.post('/links', function (req, res) {

  console.log('---------\ngot a post request');

  console.log(req.body);
  console.log('stringify:');
  var stringified = JSON.stringify(req.body).replace("%", "");
  console.log(stringified);

  needle.post(
    'https://search.crossref.org/links',
    stringified,
    {},
    function(err, resp) {
      console.log('returned from links');

      if (resp && resp.body &&
        resp.body.results && resp.body.results.length > 0 &&
        resp.body.results[0].match)
      {
        console.log(resp.body);
        console.log('match: ' + resp.body.results[0].match);

        var doiUrl = resp.body.results[0].doi;
        console.log('doiUrl:');
        console.log(doiUrl);

        var options = {
          url: doiUrl,
          headers: {
            'Accept': 'text/x-bibliography; style=apa'
            //'Accept': 'application/citeproc+json'
          }
        };
        request(options, function(cError, cResponse, cBody) {
          console.log('returned from doi using request');
          console.log(cBody);

          //var citation = JSON.parse(dBody);
          resp.body.results[0].citation = cBody;

          options.headers = {
            'Accept': 'application/citeproc+json'
          };
          request(options, function(dError, dResponse, dBody) {
            console.log('returned from doi for json');
            console.log(dBody);

            try {
              var d = JSON.parse(dBody);
              console.log(d);

              resp.body.results[0].doi = d.DOI;
              res.json(resp.body);
            } catch (e) {
              console.log('error parsing or responding');
              console.log(e);
              resp.body.results = [{
                match: false,
                errorText: 'Found an entry in CrossRef but did not find the citation on doi.org. ' + doiUrl
              }];
              res.json(resp.body);
            }
          });
        });
      }
      else {
        console.log('did not match');
        if (!resp || !resp.body) {
            console.log('resp or resp.body is not defined');
            resp = {body: { results: [{match: false}]}};
        }
        console.log(resp.body);
        res.json(resp.body);
      }

    }
  );
});

var router = express.Router();

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

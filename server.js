var express = require('express')
var app = express()
// Using needle because 'request' doesn't allow raw form data.
var needle = require('needle');
var bodyParser = require('body-parser');
// Using request because needle doesn't follow redirects.
var request = require('request');

app.use(express.static('public'));
app.use(bodyParser.json())

app.get('/links', function (req, res) {
    res.json({ message: 'message from links!' });
})

app.post('/links', function (req, res) {

    console.log('got a post request');

    console.log(req.body);
    console.log('stringify:');
    console.log(JSON.stringify(req.body));

    needle.post(
	'http://search.crossref.org/links',
	JSON.stringify(req.body),
	{},
	function(err, resp) {
	    console.log('returned from links');
	    console.log(resp.body);

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

		    var d = JSON.parse(dBody);
		    console.log(d);

		    resp.body.results[0].doi = d.DOI;
		    res.json(resp.body);		    
		});
	    });
	}
    );

})

var router = express.Router();

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})



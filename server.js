var express = require('express')
var app = express()
var needle = require('needle');
var bodyParser = require('body-parser');

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
	    res.json(resp.body);
	}
    );

})

var router = express.Router();

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})



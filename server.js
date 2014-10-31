var express = require('express')
var app = express()


app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello Word!')
})

app.get('/links', function (req, res) {
    res.json({ message: 'message from links!' });
})

var router = express.Router();

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})



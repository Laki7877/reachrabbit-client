var express  = require('express');
var app      = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var exec = require('child_process').exec;
var _ = require('lodash');

app.use(express.static(__dirname + '/app'));

app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

var protractorConfig = {};
fs.readFile('protractor.conf.template.js', 'utf8', function(err, data) {
  if (err) throw err;
  protractorConfig = data;
});

app.post('/api/start' , function(req,res) {
    var requestFile = req.body.files;
    var fileArray = '';
    for ( var i=0 ; i < requestFile.length ; i++ ) {
        var filename = "'./e2e-tests/"+requestFile[i].file+".js'";
        fileArray = fileArray + ',' + filename;
    }
    var configFile = protractorConfig
        .replace('//<FILE>//',fileArray.substring(1,fileArray.length))
        .replace('<brandEmail>',req.body.brandEmail)
        .replace('<brandPassword>',req.body.brandPassword)
        .replace('<influencerEmail>',req.body.influencerEmail)
        .replace('<influencerPassword>',req.body.influencerPassword)
        .replace('<adminEmail>',req.body.adminEmail)
        .replace('<adminPassword>',req.body.adminPassword);
    fs.writeFile('protractor.conf.js', configFile , function(err) {
        if(err) {
            console.log(err);
            throw err;
        }
        exec(['protractor protractor.conf.js --verbose'], function(err, out, code) {
            if (err) {
                return console.log(err);
            }
        });
    });
    res.send('Started Testing');
});

app.get('/api/descriptions', function(req, res) {
    var dir = './e2e-tests/';
    fs.readdir(dir, function(err, files) {
        descriptions = [];
        files.forEach( function(file) {
            descriptions.push({
                "file": file.split('.')[0]
            });
        });
        res.json(descriptions);
    });
});

app.get('/test_result/*',function(req, res) {
    console.log(req.url);
    res.sendFile(__dirname + req.url);
});

app.get('*', function(req, res) {
    res.sendFile('./app/index.html');
});

var port = 9000;
app.listen(port);
console.log("App listening on port " + port);
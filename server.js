var express = require("express");
var app     = express();
var path    = require("path");
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('keys/app_reachrabbit_com.key'),
  cert: fs.readFileSync('keys/app.reachrabbit.com.crt')
};


var port = process.env.HTTPS_PORT || 443;
app.use(express.static('app/'));
app.get('/:name',function(req,res){
  res.sendFile(path.join(__dirname+'/app/' + req.params.name + '.html'));
});


// Redirect http to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://www" + req.host + ":" + (process.env.HTTPS_PORT || 8080)  + req.originalUrl });
    res.end();
}).listen(process.env.HTTP_PORT || 8080);

https.createServer(options, app ).listen( port, function() {
    console.log('Express server listening on port ' + port);
} );

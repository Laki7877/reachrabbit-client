var express = require("express");
var app     = express();
var path    = require("path");
var https = require('https');

var fs = require('fs');

var options = {
  key: fs.readFileSync('keys/app_reachrabbit_com.key'),
  cert: fs.readFileSync('keys/app.reachrabbit.com.crt')
};


var port = 443;
app.use(express.static('app/'));
app.get('/:name',function(req,res){
  res.sendFile(path.join(__dirname+'/app/' + req.params.name + '.html'));
});

https.createServer(options, app ).listen( port, function() {
    console.log('Express server listening on port ' + port);
} );
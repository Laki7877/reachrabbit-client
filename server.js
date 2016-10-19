var express = require("express");
var app     = express();
var path    = require("path");
var http = require('http');

var port = 8080;
app.use(express.static('app/'));
app.get('/:name',function(req,res){
  res.sendFile(path.join(__dirname+'/app/' + req.params.name + '.html'));
});

http.createServer( app ).listen( port, function() {
    console.log('Express server listening on port ' + port);
} );


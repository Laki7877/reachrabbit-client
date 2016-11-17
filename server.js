var express = require("express");
var app = express();
var path = require("path");
var https = require('https');
var fs = require('fs');
var compression = require('compression')


var bundles = {};
fs.readdir(__dirname+'/app/dist', function(err, files){
  files.forEach(function(item){
    var unhashed_items = item.split(".");
    unhashed_items.shift();
    bundles[unhashed_items.join(".")] = item;
  });
});

var options = {
  key: fs.readFileSync('keys/app_reachrabbit_com.key'),
  cert: fs.readFileSync('keys/app.reachrabbit.com.crt')
};

app.set('view engine', 'ejs')

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

var port = process.env.HTTPS_PORT || 443;
app.use(compression({filter: shouldCompress}));
app.use(express.static('app/', { maxage: '24h' }));

console.log(bundles);
app.get('/:name',function(req,res){
  res.render(path.join(__dirname+'/app/' + req.params.name), {
    "bundles": bundles
  });
});

// Redirect http to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
    res.end();
}).listen(process.env.HTTP_PORT || 80);

https.createServer(options, app ).listen( port, function() {
    console.log('Express server listening on port ' + port);
} );
var app,
    path = require('path'),
    express = require('express'),
    build = require('./lib/build.js');

build();

app = express();

app.use(express.static(__dirname + '/dist'));

app.set('port', process.env.PORT || 5000);

app.get('/', function(request, response){
  response.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

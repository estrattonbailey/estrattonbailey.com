var app,
    path = require('path'),
    express = require('express'),
    build = require('./lib/build.js');

/**
 * Init Express server
 */
app = express();
app.use(express.static(__dirname + '/dist'));
app.set('port', process.env.PORT || 5000);

/**
 * Default Route
 */
app.get('/', function(request, response){
  response.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/contentful', function(req, res, next) {
  var action = req.headers['x-contentful-topic'].split('.')[2],
      type = req,
      data = req;

  console.log(action) // "change" "publish" etc
  console.log(type)
  console.log(data)

  res.sendStatus(200);
});

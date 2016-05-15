var app,
    path = require('path'),
    express = require('express'),
    body = require('body-parser'),
    build = require('./lib/build.js');

/**
 * Init Express server
 */
app = express();
app.use(express.static(__dirname + '/dist'));
app.set('port', process.env.PORT || 5000);

var bodyParser = body.json({ type: 'application/*+json' });

/**
 * Default Route
 */
app.get('/', function(request, response){
  response.sendFile(path.join(__dirname+'/dist/index.html'));
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/contentful', bodyParser, function(req, res) {
  if (!req.body) res.sendStatus(400);

  var action = req.headers['x-contentful-topic'].split('.')[2],
      data = {
        fields: req.body.fields,
        type: req.body.sys.contentType.sys.id 
      }

  build(action, data)

  res.status(200).json(req.body);
});

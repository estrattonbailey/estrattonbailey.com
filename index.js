var app,
    path = require('path'),
    express = require('express');

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
  console.log('Webhook: ', req);
  res.send(200);
  res.render('index', { title: 'WebHook Info' });
});

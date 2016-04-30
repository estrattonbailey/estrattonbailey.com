var app,
    path = require('path'),
    express = require('express'),
    contentful = require('./lib/contentful.js'),
    assemble = require('./assemblefile.js'),
    fs = require('fs');

function getTemplate(name){
  return fs.readFileSync('./src/markup/templates/'+name,'utf8');
}

/**
 * Get Contentful data and pass to
 * callback function(data)
 */
contentful(function(data){
  // Add data to Assemble build
  // assemble.data(data)

  // Manually create page for each post
  data.posts.forEach(function(post){
    console.log(post)
    var handle = post.title.toLowerCase().replace(/[\s\,\-]/g,'-');
    var path = './writing/'+handle+'/index.html';

    assemble.post(path, {content: getTemplate('post.hbs'), locals: post});
  });

  assemble.page('./index.html', {content: getTemplate('home.hbs'), locals: data});
  assemble.page('./writing/index.html', {content: getTemplate('posts.hbs'), locals: data});

  // Build Assemble
  assemble.build('build', function(err){
    if (err) {
      console.log('Build error: '+err);
      throw err;
    }
    console.log('Assemble complete.');
  });
});

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

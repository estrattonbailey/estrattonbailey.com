var app,
    path = require('path'),
    fs = require('fs'),
    contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

/**
 * Read stored data, or call new data
 */
try {
  var data = require('./data/storage.json')
} catch(e){
  console.log('Run node lib/contentful.js first to get data');
}

/**
 * Read template 
 */
function getTemplate(name){
  return fs.readFileSync('./src/markup/templates/'+name,'utf8');
}

/**
 * Get Contentful data and pass to
 * callback function(data)
 */
function build(debug, response){
  if (debug){
    assemble.page('./debug/index.html', {content: getTemplate('debug.hbs'), locals: response});
  }
  // Add data to Assemble build
  assemble.data(data)

  // Manually create page for each post
  data.posts.forEach(function(post){
    var handle = post.title.toLowerCase().replace(/[\s\,\-]/g,'-');
    var path = './writing/'+handle+'/index.html';

    post.permalink = data.site.meta.url+path;

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
}

/**
 * Default function call
 * Builds entire site
 */
var processArgs = process.argv[2];
if(processArgs === '--run'){
  build();
} 

module.exports = build;

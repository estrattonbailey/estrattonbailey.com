var app,
    path = require('path'),
    fs = require('fs'),
    config = require('../site.config.js'),
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
function build(){
  // Add full data object to Assemble build
  assemble.data(data)

  /**
   * For each type, add each entry in Contentful
   * as a page to the Assemble pages collection
   */
  for (t in config.structure.types){
    var type = config.structure.types[t];

    if (type.hasPage){
      data[t].forEach(function(o){
        var handle = o.fields.title.toLowerCase().replace(/[\s\,\-]/g,'-');
        var path = '/writing/'+handle+'/index.html';

        o.permalink = data.site.meta.url+path;

        assemble.page('.'+path, {content: getTemplate(type.template+'.hbs'), locals: o});
      });
    }
  }

  /**
   * Add pages to Assemble pages collection
   * and generate index page
   */
  for (p in config.structure.pages){
    var page = config.structure.pages[p];

    if (p === 'index'){
      assemble.page('./index.html', {content: getTemplate(page.template+'.hbs'), locals: data});
    } else {
      assemble.page('./'+p+'/index.html', {content: getTemplate(page.template+'.hbs'), locals: data});
    }
  }

  /**
   * Run Assemble's exported build task
   */
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

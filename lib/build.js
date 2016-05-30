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
  var storage = require('./data/storage.json')
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
function build(data){
  data = data || storage;

  // Add full data object to Assemble build
  assemble.data(data)

  /**
   * For each type, add each entry in Contentful
   * as a page to the Assemble pages collection
   */
  for (type in config.structure.types){
    if (config.structure.types[type].hasPage){
      data[type].forEach(function(item){

        assemble.page(
          '.'+item.path+'/index.html', 
          {
            content: getTemplate(item.template), 
            locals: item 
          }
        );

      });
    }
  }

  /**
   * Add pages to Assemble pages collection
   * and generate index page
   */
  for (p in config.structure.pages){
    var page = config.structure.pages[p],
        pageData = data.page.filter(function(item){
          return item.slug === p;
        })[0] || data;

    if (p === 'index'){
      assemble.page('./index.html', {content: getTemplate(page.template+'.hbs'), locals: pageData});
    } else {
      assemble.page('./'+p+'/index.html', {content: getTemplate(page.template+'.hbs'), locals: pageData});
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

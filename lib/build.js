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
 * Standardize data structure
 */
function scrub(data, type){
  var _return = {},
      _config = type || config.structure.types[data.type];

  for (key in data){
    _return[key] = data[key]
  }
  
  if (data.fields){
    for (key in data.fields){
      _return[key] = data.fields[key]['en-US'] || data.fields[key]
    }
  }

  _return.template = _config.template+'.hbs';
  _return.handle = (_return.title || data.title).toLowerCase().replace(/[\s\,\-]/g,'-');
  _return.path = '/' + _config.rootPath + '/' + _return.handle + '/index.html';
  _return.permalink = storage.site.meta.url+_return.path;

  return _return;
}

/**
 * Get Contentful data and pass to
 * callback function(data)
 */
function build(action, data){
  if (data){
    console.log(action, scrub(data))
  }

  // Add full data object to Assemble build
  assemble.data(storage)

  /**
   * For each type, add each entry in Contentful
   * as a page to the Assemble pages collection
   */
  for (t in config.structure.types){
    var type = config.structure.types[t];
    if (type.hasPage){
      storage[t].forEach(function(o){
        var locals = scrub(o, type);

        console.log(locals)
        assemble.page('.'+locals.path, {content: getTemplate(locals.template), locals: locals});
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

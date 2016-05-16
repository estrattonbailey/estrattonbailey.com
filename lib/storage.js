var storage,
    fs = require('fs'),
    del = require('delete'),
    config = require(__dirname+'/../site.config.js');

try {
  storage = require('./data/storage.json')
} catch(e){
  console.log('Run `node lib/contentful.js` first to get data');
}

function normalizeContentful(partial){
  console.log('NORMALIZE')
  var _config,
      _return = {};
      
  _return.id = partial.sys.id;
  _return.type = partial.sys.contentType.sys.id;
  _return.createdAt = partial.sys.createdAt;

  _config = config.structure.types[_return.type];
  
  for (key in partial.fields){
    _return[key] = partial.fields[key]['en-US'] || partial.fields[key]
  }

  if (_config.hasPage){
    _return.handle = _return.title.toLowerCase().replace(/[\s\,\-]/g,'-');
    _return.template = _config.template+'.hbs';
    _return.path = '/' + _config.rootPath + '/' + _return.handle + '/index.html';
    _return.permalink = storage.site.meta.url+_return.path;
  }

  return _return;
}

/**
 * Split data into projects/posts
 *
 * @return {object} cache Object containing all relevant Contentful data 
 */
function parseData(data){
  console.log('PARSE')
  var cache = {};

  cache.site = config;

  // Match only types defined in config
  // AND on Contentful.
  for (type in config.structure.types){
    cache[type] = data
      .filter(function(item){ 
        return item.sys.contentType.sys.id === type; 
      })
      .map(function(match){ 
        return normalizeContentful(match);
      });
  };

  return cache;
}

function writeAll(data){
  console.log('WRITE')
  var _data = parseData(data);

  del.sync(__dirname+'/data/*.json');

  fs.writeFile(
    __dirname+'/data/storage.json', 
    JSON.stringify(_data, null, 2), 
    function(err){
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('Data written to /lib/data/storage.json');
    });

  return _data;
}

function partial(partial){
  console.log('PARTIAL')
  var _partial = normalizeContentful(partial);

  console.log('UPDATE')
  for (var i = 0; i < storage[_partial.type].length; i++){
    console.log(storage[_partial.type][i])
    if (storage[_partial.type][i].id === id){
      for (key in storage[_partial.type][i]){
        storage[_partial.type][i][key] = _partial[key]
      }
    }
  } 

  writeAll()
}

module.exports = {
  all: writeAll,
  partial: partial
};

var DATA,
    fs = require('fs'),
    del = require('delete'),
    config = require(__dirname+'/../site.config.js');

try {
  var storage = require('./data/storage.json')
} catch(e){
  console.log('Run `node lib/contentful.js` first to get data');
}

function scrubFields(target, object){
  if (!object){
    object = target;
    var target = {};
  }

  for (key in object.fields){
    target[key] = object.fields[key]['en-US'] || object.fields[key]
  }

  return target;
}

/**
 * Split data into projects/posts
 *
 * @return {object} cache Object containing all relevant Contentful data 
 */
function parseData(data){
  var cache = {};

  cache.site = config;

  for (type in config.structure.types){
    cache[type] = data
      .filter(function(o){ 
        return o.sys.contentType.sys.id === type 
      })
      .map(function(o){ 
        var _return = {};

        scrubFields(_return, o);

        _return.createdAt = o.sys.createdAt;
        _return.id = o.sys.id;

        return _return; 
      });
  };

  DATA = cache;

  return cache;
}

function writeAll(data){
  DATA = parseData(data);

  del.sync(__dirname+'/data/*.json');

  fs.writeFile(
    __dirname+'/data/storage.json', 
    JSON.stringify(DATA, null, 2), 
    function(err){
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('Data written to /lib/data/storage.json');
    });

  return DATA;
}

function partial(partial){
  console.log('DATA: ',DATA)
  console.log('Partial: ',partial)
}

module.exports = {
  all: writeAll,
  partial: partial
};

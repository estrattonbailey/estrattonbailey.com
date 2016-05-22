var STORAGE,
    fs = require('fs'),
    del = require('delete'),
    settings = require(__dirname+'/../site.config.js');

/**
 * If STORAGE has been written, 
 * use that. If not, let us know.
 */
try {
  STORAGE = require('./data/storage.json')
} catch(e){
  console.log('You should only see this if the app is starting up.');
}

/**
 * Formats raw API data
 *
 * @param {object} partial Raw data partial from Contentful 
 * @return {object} Freshly-formatted data, ready for consumption
 */
function normalizeContentful(partial){
  var typeSettings,
      _return = {};
      
  // Set some basic meta
  _return.id = partial.sys.id;
  _return.type = partial.sys.contentType.sys.id;
  _return.createdAt = partial.sys.createdAt;

  // Use passed type value to get 
  // settings for that type
  typeSettings = settings.structure.types[_return.type];
  
  // Update field values (if needed).
  // If the data is coming from a webhook,
  // it has the localization string
  for (key in partial.fields){
    _return[key] = partial.fields[key]['en-US'] || partial.fields[key]
  }

  // If our settings for this type
  // say we need a page, add values required
  // to build a page in Assemble
  if (typeSettings.hasPage){
    _return.handle = _return.title.toLowerCase().replace(/[\s\,\-\.]/g,'-').replace(/[\,\.\?\-]+$/, '') || 'ass';
    _return.template = typeSettings.template+'.hbs';
    _return.path = '/' + typeSettings.rootPath + '/' + _return.handle + '/index.html';
    _return.permalink = settings.meta.url+_return.path;
  }

  return _return;
}

/**
 * Split data into projects/posts
 *
 * @param {object} data Raw data from Contentful API call
 * @return {object} Object containing Contentful data + settings 
 */
function parseData(data){
  var cache = {};

  // Attach our site.config.js settings
  cache.site = settings;

  // Match only types defined in our settings 
  // AND on Contentful. Write type to cache{}
  for (type in settings.structure.types){
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

/**
 * Write formatted data to disk
 *
 * @param {object} data Formatted data
 */
function write(data){
  del.sync(__dirname+'/data/storage.json');

  fs.writeFile(
    __dirname+'/data/storage.json', 
    JSON.stringify(data, null, 2), 
    function(err){
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('Data written to /lib/data/storage.json');
    });
}

function remove(partial){
  var _data = STORAGE || {},
      id = partial.sys.id,
      type = partial.sys.contentType.sys.id;

  for (var i = 0; i < _data[type].length; i++){
    if (_data[type][i] && _data[type][i].id === id){
      _data[type][i] = {};
      delete _data[type][i];
      console.log('DELETING: ',id);
    }
  } 

  write(_data)

  return _data;
}

/**
 * Exported function.
 *
 * Updates types in STORAGE, for export to
 * Assemble build.
 *
 * Takes raw 'partial', normalizes its format
 * to match the storage.json file we wrote, and
 * updates the values with the new data.
 *
 * @param {object} partial Raw data from Contentful webhook
 * @param {function} cb Callback to execute post-data-format
 */
function partial(partial, action, cb){
  var _partial,
      _items,
      updating = false,
      _data = STORAGE;

  if (action === 'delete' || action === 'unpublish'){
    return cb(remove(partial));
  } 

  _partial = normalizeContentful(partial);
  _items = _data[_partial.type];

  _items.filter(function(item){
    return item.id === _partial.id 
  }).forEach(function(item){
    updating = true;
    for (key in item){
      item[key] = _partial[key]
    }
    console.log('UPDATING: '+item.id+':'+_partial.id);
  });

  if (!updating){
    _items.push(_partial)
    console.log('ADDING: ',_partial.id);
  }

  write(_data);

  cb(_data)
}

/**
 * Exported function.
 *
 * Format data with parseData()
 * and write with write()
 *
 * @param {object} raw Raw response from Contentful API
 */
function writeAll(raw){
  var _data = parseData(raw) || STORAGE;
  write(_data);
}

module.exports = {
  all: writeAll,
  partial: partial
};

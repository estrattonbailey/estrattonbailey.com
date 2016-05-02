var client,
    contentful = require('contentful'),
    config = require(__dirname+'/../site.config.js'),
    store = require(__dirname+'/storage.js');

/**
 * Import local ENV data
 * Contains API key and pass
 */
require('dotenv').config();

/**
 * Create Contentful Client
 */
client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_API
});

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
        return {
          fields: o.fields,
          createdAt: o.sys.createdAt
        }
      });
  };

  return cache;
}

/**
 * Exported function
 * @param {function} cb Passed callback to run with Contentful Data
 */
function getData(cb){
  client.getEntries()
    .then(function (entries) {
      return cb(parseData(entries.items));
    }, function(error){
      console.log(error);
      throw error;
    });
}

/**
 * Run when called directly
 * Stores data to JSON file
 *
 * $ node lib/contentful.js --build
 */
var processArgs = process.argv[2];
if(processArgs === '--run'){
  getData(store)
} 

module.exports = getData;

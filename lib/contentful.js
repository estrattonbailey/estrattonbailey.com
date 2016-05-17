var client,
    contentful = require('contentful'),
    store = require(__dirname+'/storage.js');

/**
 * Import local ENV data
 * Contains API key and pass
 */
try {
  require('dotenv').config({silent: true});
} catch(e){}

/**
 * Create Contentful Client
 */
client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_API
});

/**
 * Exported function
 * @param {function} cb Passed callback to run with Contentful Data
 */
function getData(cb){
  client.getEntries()
    .then(function (entries) {
      console.log('Successful API call')
      return cb(entries.items);
    }, function(error){
      console.log('Unsuccessful API call')
      console.log('ERROR: ',error);
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
  getData(store.all)
} 

module.exports = getData;

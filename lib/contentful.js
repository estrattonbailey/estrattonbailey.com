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
  var projects, posts, cache;

  projects = data
    .filter(function(project){ 
      return project.sys.contentType.sys.id === 'project' 
    })
    .map(function(project){ 
      return {
        title: project.fields.title,
        caption: project.fields.caption,
        url: project.fields.url,
        createdAt: project.sys.createdAt
      }
    });

  posts = data
    .filter(function(post){ 
      return post.sys.contentType.sys.id === 'post' 
    })
    .map(function(post){ 
      return {
        title: post.fields.title,
        body: post.fields.body,
        excerpt: post.fields.excerpt,
        createdAt: post.sys.createdAt
      }
    });
    
  cache = {
    site: config || {},
    projects: projects,
    posts: posts
  }

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
if(processArgs === '--build'){
  getData(store)
} 

module.exports = getData;

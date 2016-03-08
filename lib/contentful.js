var client,
    contentful = require('contentful'),
    config = require('./../site.config.js');

require('dotenv').config();

client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_API
});

function getData(cb){
  client.getEntries()
    .then(function (entries) {
      return cb(parseData(entries.items));
    }, function(error){
      console.log(error);
      throw error;
    });
}

function parseData(data){
  var projects, posts, cache;

  projects = data
    .filter(function(project){ return project.sys.contentType.sys.id === 'project' })
    .map(function(project){ return {
      title: project.fields.title,
      caption: project.fields.caption,
      url: project.fields.url,
      createdAt: project.sys.createdAt
    }});

  posts = data
    .filter(function(post){ return post.sys.contentType.sys.id === 'post' })
    .map(function(post){ return {
      title: post.fields.title,
      body: post.fields.body,
      excerpt: post.fields.excerpt,
      createdAt: post.sys.createdAt
    }});
    
  cache = {
    site: config || {},
    projects: projects,
    posts: posts
  }

  return cache;
}

module.exports = getData;

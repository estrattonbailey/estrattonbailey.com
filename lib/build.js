var fs = require('fs'),
    contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

function Builder(){
  var dataCache, posts, projects;

  contentful(function(data){
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

    dataCache = {
      site: require('./../src/site.config.json') || {},
      projects: projects,
      posts: posts
    }

    assemble.assemblify(dataCache);

    fs.writeFile('./data/cache.json', JSON.stringify(dataCache, null, 2), function(err){
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('dataCache > cache.json');
    });
  });
}

module.exports = Builder;

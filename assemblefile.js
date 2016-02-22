var site, config,
    assemble = require('assemble'),
    rename = require('gulp-rename'),
    watch = require('base-watch'),
    get = require('get-value');

/**
 * Define Site
 */
site = assemble({
  layout: 'default' 
});

/**
 * Pull in site.config.json
 */
site.data({
  site: require('./site.config.json')
});

/**
 * Init
 */
site.use(watch());
site.create('posts');

/**
 * Helpers
 */
site.helpers('./helpers/*.js');
site.helper('markdown', require('helper-markdown'));
site.helper('get', function(prop) {
  return get(this.context, prop);
});

/**
 * Tasks
 */
site.task('load', function(cb){
  site.layouts('./src/markup/layouts/*.hbs');

  site.partials('./src/markup/modules/*.hbs');
  site.partials('./src/markup/components/*.hbs');

  site.pages('./src/markup/*.hbs');
  site.posts('./src/posts/**/*.md');

  cb()
});
site.task('pages', function(){
  return site.toStream('pages', config)
    .pipe(site.renderFile())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(site.dest('./dist'));
});
site.task('posts', function(){
  return site.toStream('posts', config)
    .pipe(site.renderFile())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(site.dest('./dist'));
});
site.task('watch:pages', function(){
  site.watch(['./src/markup/**/*.hbs'], ['pages']);
});
site.task('watch:posts', function(){
  site.watch(['./src/posts/**/*.md'], ['posts']);
});

/**
 * Default
 * Runs watch, which in turn runs the builds
 * for pages and posts.
 */
site.task('default', 'load', site.parallel(['watch:pages', 'watch:posts']));

/**/
module.exports = site;

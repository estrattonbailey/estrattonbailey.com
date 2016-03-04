var site, config,
    assemble = require('assemble'),
    rename = require('gulp-rename'),
    watch = require('base-watch'),
    get = require('get-value'),
    rimraf = require('rimraf');

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
  site: require('./src/site.config.json')
});

/**
 * Init
 */
site.use(watch());
site.create('posts');

/**
 * Helpers
 */
site.helper('markdown', require('helper-markdown'));
site.helper('get', function(prop) {
  return get(this.context, prop);
});
site.helper('asset', function(file){
  if (file.indexOf('.js') > -1){
    return './assets/js/' + file
  } else if (file.indexOf('.css') > -1){
    return './assets/css/' + file
  } else if (file.indexOf('.png') > -1){
    return './assets/images/' + file
  } else if (file.indexOf('.jpg') > -1){
    return './assets/images/' + file
  } else if (file.indexOf('.svg') > -1){
    return './assets/images/' + file
  }
});
site.helper('limit', function(context, block){
  var ret = "",
      offset = parseInt(block.hash.offset) || 0,
      limit = parseInt(block.hash.limit) || 5,
      i = (offset < context.length) ? offset : 0,
      j = ((limit + offset) < context.length) ? (limit + offset) : context.length;

  for(i,j; i<j; i++) {
    ret += block(context[i]);
  }

  return ret;
});

/**
 * Tasks
 */
function cleanDest(){
  rimraf('./dist/*.html', function(err){
    if (err) throw err
  });
}
site.task('load', function(cb){
  site.layouts('./src/markup/layouts/*.hbs');

  site.partials('./src/markup/modules/*.hbs');
  site.partials('./src/markup/components/*.hbs');

  site.pages('./src/markup/*.hbs');
  site.posts('./src/posts/**/*.md');

  cleanDest();

  cb()
});
site.task('pages', function(){
  return site.toStream('pages')
    .pipe(site.renderFile())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(site.dest('./dist'));
});
site.task('posts', function(){
  return site.toStream('posts')
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
site.task('watch', site.parallel(['watch:pages', 'watch:posts']));
site.task('default', ['load', 'pages', 'posts']);

/**
 * API to build
 */
site.assemblify = function(data){
  site.data(data)
  site.build('default', function(err){
    if (err) {
      console.log(err)
      throw err;
    }
    console.log('Done!');
  });
}

/**/
module.exports = site;

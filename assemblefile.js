var site,
    config = require('./site.config.js'),
    assemble = require('assemble'),
    rename = require('gulp-rename'),
    watch = require('base-watch'),
    del = require('delete'),
    helpers = require(__dirname+'/lib/helpers.js');

/**
 * Define Site
 */
site = assemble({
  layout: 'default' 
});

/**
 * Init
 */
site.create('pages', {isPartial: true});

/**
 * Helpers
 */
function clean(){
  del.sync(['./dist/**/**/*.html'], function(err) {
    if (err) throw err;
    console.log('done!');
  });

  console.log('Clean dist/ directory complete.')
};
Object.keys(helpers).forEach(function(name, i){
  site.helper(name, helpers[name]);
});
site.on('error', function(err) {
  console.error(err);
});

/**
 * Tasks
 */
site.task('load', function(cb){
  var partialsGlob = [],
      layoutsGlob = [],
      partials = config.assemble.partials,
      layouts = config.assemble.layouts;

  if (Array.isArray(layouts.patterns)){
    for (var i = 0; i < layouts.patterns.length; i++){
      layoutsGlob.push(layouts.base+layouts.patterns[i])
    }
  } else {
    layoutsGlob = layouts.base+layouts.patterns
  }

  if (Array.isArray(partials.patterns)){
    for (var i = 0; i < partials.patterns.length; i++){
      partialsGlob.push(partials.base+partials.patterns[i])
    }
  } else {
    partialsGlob = partials.base+partials.patterns
  }

  site.layouts(layoutsGlob);
  site.partials(partialsGlob);

  clean();

  cb()
});
site.task('pages', function(){
  return site.toStream('pages')
    .pipe(site.renderFile())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(site.dest(__dirname+'/dist'));
});

/**
 * Default
 * Runs watch, which in turn runs the builds
 * for pages and posts.
 */
site.task('default', ['build']);
site.task('build', ['load', 'pages']);

module.exports = site;

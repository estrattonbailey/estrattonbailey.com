var config = require('../../package.json')
var initScripts = require('./lib/initScripts.js')

document.addEventListener('DOMContentLoaded', function(){
  /**
   * Find all specified elements
   * in the DOM and init their javascripts
   */
  config.barrel.types.forEach(function(type){
    var nodes = [].slice.call(document.querySelectorAll('[data-'+type+']'));

    for (var i = 0; i < nodes.length; i++){
      initScripts(nodes[i], type)
    }
  });
});

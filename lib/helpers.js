var remarkable = require('remarkable'),
    hljs = require('highlight.js');

var md = new remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}

      return ''; // use external default escaping
    }
  });

var helpers = {
  log: function(context) {
    console.log(arguments);
    console.log(context);      // the object passed to the helper
    console.log(context.hash); // hash arguments, like `foo="bar"`

    console.log(this);         // handlebars context
    console.log(this.options); // assemble `options`
    console.log(this.context); // context of the current "view"
    console.log(this.app);     // assemble instance
  },
  markdown: function(data, options){
    return md.render(data)
  },
  asset: function(file){
    if (file.indexOf('.js') > -1){
      return '/assets/js/' + file
    } else if (file.indexOf('.css') > -1){
      return '/assets/css/' + file
    } else if (file.indexOf('.png') > -1){
      return '/assets/images/' + file
    } else if (file.indexOf('.jpg') > -1){
      return '/assets/images/' + file
    } else if (file.indexOf('.svg') > -1){
      return '/assets/images/' + file
    }
  }, 
  limit: function(array, limit, options){
    var result = '';

    for (var i = 0; i < limit; i++){
      result += options.fn(array[i]) 
    }

    return result;
  }
}

module.exports = helpers;

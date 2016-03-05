var helpers = {
  markdown: require('helper-markdown'),
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

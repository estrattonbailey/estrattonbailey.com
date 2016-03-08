var contentful = require(__dirname+'/../contentful.js'),
    store = require(__dirname+'/storage.js');

contentful(function(data){
  store(data);
});

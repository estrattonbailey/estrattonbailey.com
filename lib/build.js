var contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

function Builder(){
  assemble.build('default', function(err){
    if (err) throw err;
    console.log('Builder error!')
  });

  contentful(function(data){
  });
}

module.exports = Builder;

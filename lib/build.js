var contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

function Builder(){
  assemble.assemblify({
    content: 'Eric'
  });

  contentful(function(data){
  });
}

module.exports = Builder;

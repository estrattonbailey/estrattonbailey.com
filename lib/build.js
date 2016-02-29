var contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

function Builder(){
  console.log(assemble)

  contentful(function(data){
    console.log(data)
  });
}

module.exports = Builder;

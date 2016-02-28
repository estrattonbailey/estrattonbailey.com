var contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

console.log(assemble)

contentful(function(data){
  console.log(data)
});

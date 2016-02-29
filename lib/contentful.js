var client,
    contentful = require('contentful'),
    config = require('../src/private.config.js');

client = contentful.createClient(config);

function Data(cb){
  client.getEntries()
    .then(function (entries) {
      cb(entries.items)
    }, function(error){
      console.log(error)
    });
}

module.exports = Data;

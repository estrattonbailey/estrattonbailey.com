var client,
    contentful = require('contentful');

client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_API
});

function Data(cb){
  client.getEntries()
    .then(function (entries) {
      cb(entries.items)
    }, function(error){
      console.log(error)
    });
}

module.exports = Data;

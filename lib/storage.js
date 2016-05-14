var fs = require('fs'),
    del = require('delete');

function storage(data){
  del.sync(__dirname+'/data/*.json');

  fs.writeFile(
    __dirname+'/data/storage.json', 
    JSON.stringify(data, null, 2), 
    function(err){
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('Data written to /lib/data/storage.json');
    });

  return data;
}

module.exports = storage;

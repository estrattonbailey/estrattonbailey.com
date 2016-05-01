var fs = require('fs');

function storage(data){
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

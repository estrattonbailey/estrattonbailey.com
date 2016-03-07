var fs = require('fs');

function storage(data){
  console.log('Writing data')
  fs.writeFile('./data/cache.json', JSON.stringify(data, null, 2), function(err){
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('dataCache > cache.json');
  });
}

module.exports = storage;

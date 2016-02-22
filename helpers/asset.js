function asset(file){
  if (file.indexOf('.js') > -1){
    return './dist/assets/js/' + file
  } else if (file.indexOf('.css') > -1){
    return './dist/assets/css/' + file
  } else if (file.indexOf('.png') > -1){
    return './dist/assets/images/' + file
  } else if (file.indexOf('.jpg') > -1){
    return './dist/assets/images/' + file
  } else if (file.indexOf('.svg') > -1){
    return './dist/assets/images/' + file
  }
}

module.exports = asset; 

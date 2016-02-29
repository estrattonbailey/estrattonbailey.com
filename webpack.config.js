var path = require('path');

module.exports = {
  entry: {
    app: './src/js/index.js'
  },
  output: {
    path: './dist/assets/js/',
    filename: './[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'uglify'
      }
    ]
  }
}

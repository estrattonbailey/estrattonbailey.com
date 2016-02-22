module.exports = {
  entry: './src/js/index.js',
  output: {
    path: './dist/assets/js/',
    filename: './main.js'
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

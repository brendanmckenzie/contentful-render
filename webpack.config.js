var path = require('path')

module.exports = {
  entry: {
    'index': './source/index.js',
  },

  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },

  externals: [
  ],

  resolve: {
    root: __dirname,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  plugins: [
  ],
  target: 'node',
  devtool: 'source-map',
}

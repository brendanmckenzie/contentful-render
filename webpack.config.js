var path = require('path')
var webpack = require('webpack')

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
    'aws-sdk',
    'bluebird',
    'contentful',
    'dot',
    'ejs',
    'express',
    'fs-extra',
    'moment',
    'path',
    'react',
    'react-dom',
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
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false
      },
      comments: false,
      sourceMap: false
    }),
    new webpack.optimize.DedupePlugin()
  ],
  target: 'node',
  devtool: 'source-map',
}

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
  ],
  target: 'node',
  devtool: 'source-map',
}

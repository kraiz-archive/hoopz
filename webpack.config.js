'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'src/client.js'),
    path.join(__dirname, 'src/client.css'),
  ],
  node: {
    fs: 'empty',
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'jade!src/client.jade',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      DEVELOPING: true,
    }),
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8')),
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
  postLoaders: [{
    test: /\.js$/,
    include: /node_modules\/pixi\.js/,
    loader: 'transform/cacheable?brfs',
  }],
};

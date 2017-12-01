const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const baseConfig = {
  dist: 'dist',
  plugins: [
    new CleanWebpackPlugin([baseConfig.dist])
  ],
  module: {
    rules: [
      {
        text: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            preset: [
              'env',
              'react'
            ]
          }
        }
      }
    ]
  }
};

function produceConfig(appDirs) {
  return appDirs.map((dir) => {
    return {
      entry: path.resolve(__dirname, dir),
      output: {
        path: path.resolve(__dirname, dir, baseConfig.dist),
        filename: '[name].js',
        pathinfo: true
      },
      module: {
        rules: baseConfig.module.rules.concat([])
      },
      plugins: baseConfig.plugins.concat([
        new HtmlWebpackPlugin(),
      ])
    };
  });
}

function getAppDirectoryNames() {
  const filenames = fs.readdirSync(__dirname);
  const appDirs = [];
  filenames.forEach((filename) => {
    try {
      if (fs.lstatSync(filename).isDirectory()) {
        appDirs.push(filename);
      }
    } catch (e) {
      console.error(`${filename}出错`);
    }
  });
  return appDirs;
}

function run() {
  const appDirs = getAppDirectoryNames();
  const configs = produceConfig(appDirs);
  webpack(configs, (err, stats) => {
    if (err) {
      throw err;
    }
  });
}

run();

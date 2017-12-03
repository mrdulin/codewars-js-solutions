const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const util = require('util');

console.inspect = function (obj, depth = 3) {
  console.log(util.inspect(obj, { showHidden: true, depth }));
}

const dist = 'dist';
const ports = [2223, 2224];

const baseConfig = {
  entry: {
    vendor: [
      'react'
    ]
  },
  plugins: [
    new CleanWebpackPlugin([dist])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'env',
              'react'
            ]
          }
        }
      }
    ]
  },
  devtool: 'eval-source-map'
};

function produceConfig(appDirs) {
  return appDirs.map((dir, idx) => {
    const entry = path.resolve(__dirname, dir);
    return {
      entry,
      output: {
        path: path.resolve(__dirname, dir, dist),
        filename: '[name].js',
        pathinfo: true
      },
      module: {
        rules: baseConfig.module.rules.concat([])
      },
      plugins: baseConfig.plugins.concat([
        new HtmlWebpackPlugin({
          template: entry + '/index.html'
        })
      ]),
      devServer: baseConfig.devServer
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

const appDirs = getAppDirectoryNames();
const configs = produceConfig(appDirs);
const multipleCompiler = webpack(configs)
const compilers = multipleCompiler.compilers;

function run() {
  compilers.forEach((compiler) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        throw err;
      }
    })
  });
}

function server() {
  compilers.forEach((compiler, idx) => {
    const port = ports[idx];
    const server = new WebpackDevServer(compiler, {
      contentBase: compiler.options.entry + '/tmp',
      compress: true,
      host: '0.0.0.0',
      stats: {
        colors: true
      },
      port
    });
    server.listen(port, 'localhost', (error) => {
      if (error) {
        throw error;
      }
      console.log(`${appDirs[idx]}服务器启动成功 -> http://localhost:${port}`);
    });
  });
}

// run();
server();

const webpack = require('webpack');
const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlConfig = {
  title: 'Tron',
  meta: {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    author: process.env.npm_package_author,
    description: process.env.npm_package_description,
    keywords: process.env.npm_package_keywords,
    charset: 'utf8'
  }
}

module.exports = {
  entry: {
    client: ['babel-polyfill', './src/client.ts'],
    vendors: ['phaser'],
  },
  devtool: mode === 'development' ? 'inline-source-map' : false,
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "client")
    }),
    new HtmlWebpackPlugin({
      ...htmlConfig,
      filename: '../index.html',
      template: 'src/index.html'
    })
  ],
  mode,
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/client/scripts/'),
    publicPath: '/scripts',
  },
  devServer: {
    contentBase: path.join(__dirname, '/client/scripts'),
    watchContentBase: true,
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:3000', // server and port to redirect to
        secure: false, // don't use https
      },
    ],
    overlay: {
      warnings: true, // default false
      errors: true, // default false
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      scenes: path.resolve(__dirname, 'src/scenes/'),
      'game-objects': path.resolve(__dirname, 'src/game-objects/'),
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

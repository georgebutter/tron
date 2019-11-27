const webpack = require('webpack');
const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    client: ['babel-polyfill', './src/client.ts'],
    vendors: ['phaser']
  },
  devtool: mode === 'development' ? 'inline-source-map' : false,
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "client")
    }),
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

const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlConfig = {
  title: 'Tron',
  meta: {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    author: process.env.npm_package_author,
    description: process.env.npm_package_description,
    keywords: process.env.npm_package_keywords,
    charset: 'utf8',
  },
};

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode,
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, 'public'),
    }),
    new HtmlWebpackPlugin({
      ...htmlConfig,
      filename: '../public/index.html',
      template: 'src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {from: 'src/assets', to: 'assets'},
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'scenes': path.resolve(__dirname, 'src/scenes/'),
      'game-objects': path.resolve(__dirname, 'src/game-objects/'),
      'constants': path.resolve(__dirname, 'src/constants/'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

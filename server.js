const express = require('express');
const app = express();

const env = process.env.NODE_ENV || 'development';
const port = 3000;

if (env === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('./webpack.config.js');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

app.use(express.static('client'));

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

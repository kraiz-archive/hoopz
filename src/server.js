'use strict';

/* eslint-disable global-require */
const path = require('path');
const fs = require('fs');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const GameServer = require('./server/gameserver');
const log = require('./server/log');
const config = require('./shared/config');

const distFolder = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 3000;
const app = express();
const httpServer = new http.Server(app);
const io = socketio(httpServer, config.server.socketio);
const gameServer = new GameServer(io); // eslint-disable-line no-unused-vars

// "detect" mode
let developing;
try {
  fs.accessSync(distFolder, fs.F_OK);
  developing = false;
} catch (e) {
  developing = true;
}

if (developing) {
  // developing mode - serve code by webpack with autoreload
  const webpackConfig = require('../webpack.config.js');
  const compiler = require('webpack')(webpackConfig);
  const middleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: 'errors-only',
  });
  app.use(middleware);
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(
      path.join(distFolder, 'index.html')
    ));
    res.end();
  });
} else {
  // production mode - serve code from dist folder
  app.use(express.static(distFolder));
  app.get('/', (req, res) => res.sendFile(path.join(distFolder, 'index.html')));
}

httpServer.listen(port, '0.0.0.0', err => {
  if (err) log.error(err);
  if (developing) log.info(`Serving to http://localhost:${port}`);
});

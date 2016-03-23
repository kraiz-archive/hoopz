'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const reload = require('reload');
const GameServer = require('./hoopz/gameserver');
const log = require('./hoopz/log');

const distFolder = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 3000;
const app = express();
const httpServer = http.Server(app);
const io = socketio(httpServer);
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
  const config = require('../webpack.config.js');
  const compiler = require('webpack')(config);
  const middleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: 'errors-only'
  });
  app.use(middleware);
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(
      path.join(distFolder, 'index.html')
    ));
    res.end();
  });
  reload(httpServer, app, [0], false);
} else {
  // production mode - serve code from dist folder
  app.use(express.static(distFolder));
  app.get('/', (req, res) => res.sendFile(path.join(distFolder, 'index.html')));
}

httpServer.listen(port, '0.0.0.0', err => {
  if (err) log.error(err);
  if (developing) log.info('Serving to http://localhost:' + port);
});

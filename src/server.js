import path from 'path';
import fs from 'fs';
import express from 'express';
import socketio from 'socket.io';
import {Server} from 'http';
import * as log from 'winston';
import GameServer from './hoopz/gameserver';

const port = process.env.PORT || 3000;
const app = express();
const httpserver = Server(app);
const io = socketio(httpserver);
const gameserver = new GameServer(io); // eslint-disable-line no-unused-vars

// "detect" mode
let developing;
try {
  fs.accessSync(path.join(__dirname, '..', 'dist'), fs.F_OK);
  developing = false;
} catch (e) {
  developing = true;
}

if (developing) {
  // developing mode - serve code by webpack
  const config = require('../webpack.config.js');
  const compiler = require('webpack')(config);
  const middleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      noInfo: true,
      quiet: true,
      lazy: true,
      colors: true,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(middleware);
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(
      path.join(__dirname, 'dist', 'index.html')
    ));
    res.end();
  });
} else {
  // production mode - serve code from dist folder
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}

httpserver.listen(port, '0.0.0.0', err => {
  if (err) log.error(err);

  if (developing) {
    log.info('Serving to http://localhost:' + port);
  }
});

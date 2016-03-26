'use strict';

/* eslint no-console: 0 */
import io from 'socket.io-client';
import config from './shared/config';

window.onload = () => {
  const socket = io.connect('/', config.client.socketio);
  const game2join = window.location.hash.slice(1);

  if (DEVELOPING) {
    window.datGui = new dat.GUI();
    window.datGui.close();
    config.setupGui(window.datGui);
  }

  socket.on('connected', data => {
    console.info('connected', data);
    console.warn('join', {
      id: game2join || null,
    });
    socket.emit('join', {
      id: game2join || null,
    });
  });

  socket.on('joined', game => {
    console.info(`joined ${game.id}`);
    window.location.hash = game.id;
  });

  socket.on('state', state => {
    console.info('state', state);
    console.info('testGuiAttribute', config.client.testGuiAttribute);
  });
};

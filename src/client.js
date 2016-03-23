'use strict';

/* eslint no-console: 0 */
import io from 'socket.io-client';
import config from './shared/config';

const socket = new io.connect('/', config.client.socketio);
const game2join = window.location.hash.slice(1);

socket.on('connected', data => {
  console.info('connected', data);
  console.warn('join', {id: game2join || null});
  socket.emit('join', {id: game2join || null});
});

socket.on('joined', game => {
  console.info('joined with id: ' + game.id);
  window.location.hash = game.id;
});

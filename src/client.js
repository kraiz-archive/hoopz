/* eslint no-console: 0 */
import io from 'socket.io-client';

const socket = io.connect('/');
const game2join = window.location.hash.slice(1);

socket.on('connected', data => {
  console.error('-------------------reconnect----------------------');
  console.info('connected', data);
  console.warn('join', {id: game2join || null});
  socket.emit('join', {id: game2join || null});
});

socket.on('joined', game => {
  console.info('joined with id: ' + game.id);
  window.location.hash = game.id;
});

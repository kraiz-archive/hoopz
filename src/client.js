'use strict';

/* eslint no-console: 0 */
import io from 'socket.io-client';
import config from './shared/config';
import World from './client/world';
import AutoDetectInput from './client/input';

const PIXI = require('pixi.js');

const socket = io.connect('/', config.client.socketio);
const game2join = window.location.hash.slice(1);

if (DEVELOPING && typeof dat !== 'undefined') {
  window.datGui = new dat.GUI();
  window.datGui.close();
  config.setupGui(window.datGui);
}

const world = new World();
socket.on('joined', game => { window.location.hash = game.id; });
socket.on('state', state => world.onUpdate(state));
socket.on('connected', () => {
  socket.emit('join', {
    id: game2join || null,
  });
});

const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
  backgroundColor: 0x1099cc,
});
document.body.appendChild(renderer.view);

function animate() {
  requestAnimationFrame(animate);
  world.onFrame(Date.now() - config.client.rendering.interpolationTime);
  renderer.render(world.stage);
}
animate();

const input = new AutoDetectInput();
function sendInput() {
  console.log(input.pressed);
}
setInterval(sendInput, 1000);

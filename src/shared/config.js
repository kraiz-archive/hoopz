module.exports.server = {
  socketio: {
    transports: ['websocket'],
  },
};

module.exports.client = {
  rendering: {
    interpolationTime: 500,
  },
  socketio: {
    reconnectionDelay: 5000, // wait for browser reload
    transports: ['websocket'],
  },
  input: {
    speed: {
      normal: 1,
      fast: 2,
    },
  },
};

module.exports.setupGui = function setupGui(gui) {
  const rendering = gui.addFolder('rendering');
  rendering.add(module.exports.client.rendering, 'interpolationTime', 0, 2000);

  const input = gui.addFolder('input');
  const speed = input.addFolder('speed');
  speed.add(module.exports.client.input.speed, 'normal', 0, 20);
  speed.add(module.exports.client.input.speed, 'fast', 0, 20);
};

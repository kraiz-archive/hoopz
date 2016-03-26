module.exports.server = {
  socketio: {
    transports: ['websocket'],
  },
};

const client = {
  testGuiAttribute: 10,
  socketio: {
    reconnectionDelay: 5000, // wait for browser reload
    transports: ['websocket'],
  },
};
module.exports.client = client;

module.exports.setupGui = function setupGui(gui) {
  gui.add(client, 'testGuiAttribute');
};

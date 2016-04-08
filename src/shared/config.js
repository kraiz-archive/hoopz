module.exports.server = {
  socketio: {
    transports: ['websocket'],
  },
};

const client = {
  interpolationTime: 500,
  socketio: {
    reconnectionDelay: 5000, // wait for browser reload
    transports: ['websocket'],
  },
};
module.exports.client = client;

module.exports.setupGui = function setupGui(gui) {
  gui.add(client, 'interpolationTime', 0, 2000);
};

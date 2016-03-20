import uuid from 'node-uuid';
import * as log from 'winston';

export default class GameServer {

  constructor() {
    this.players = [];
    log.info('GameServer instanciated');
  }

  newConnection(socket) {
    const player = {
      id: uuid(),
      socket: socket
    };
    this.players.push(player);
    socket.emit('connected', {id: player.id});
    log.debug('a user connected', player);
  }

}

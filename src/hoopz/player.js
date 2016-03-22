import shortid from 'shortid';
import Vector from 'victor';


export default class Player {

  constructor(socket) {
    this.id = shortid.generate();
    this.game = null;
    this.pos = new Vector();
    this.socket = socket;
    this.socket.on('disconnect', () => this.onDisconnect());
  }

  serialize() {
    return {
      id: this.id,
      pos: this.pos.toObject()
    };
  }

  toString() {
    return `Player(${this.id})`;
  }

  join(game) {
    this.game = game;
    this.socket.emit('joined', {id: game.id});
    this.socket.join(game.id);
  }

  onDisconnect() {
    if (this.game) this.game.leave(this);
  }

}

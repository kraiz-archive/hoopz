import shortid from 'shortid';
import NanoTimer from 'nanotimer';
import log from './log';

export default class Game {

  constructor(id, socket, server) {
    this.id = id || shortid.generate();
    this.server = server;
    this.players = [];
    this.running = false;
    this.updateTimer = new NanoTimer();
    this.broadcastTimer = new NanoTimer();
    this.socket = socket.to(this.id);
    this.tick = 0;
  }

  serialize() {
    return {
      id: this.id,
      tick: this.tick,
      players: this.players.map(p => p.serialize())
    };
  }

  toString() {
    return `Game(${this.id},p#${this.players.length})`;
  }

  join(player) {
    this.players.push(player);
    log.info(`${player} joined ${this}`);
    player.join(this);
    if (!this.running) this.start();
  }

  leave(player) {
    this.players.splice(this.players.findIndex(p => p.id === player.id), 1);
    log.info(`${player} left ${this}`);
    if (this.players.length === 0) {
      this.stop();
    }
  }

  start() {
    log.info(`Starting ${this}`);
    this.running = true;
    this.tick = 0;
    this.updateTimer.setInterval(this.update.bind(this), '', '100m');
    this.broadcastTimer.setInterval(this.broadcast.bind(this), '', '1s');
  }

  stop() {
    log.info(`Stopping ${this}`);
    this.running = false;
    this.updateTimer.clearInterval();
    this.updateTimer.clearInterval();
    this.server.closeGame(this);
  }

  update() {
    this.tick++;
    // do the world updates here
  }

  broadcast() {
    this.socket.emit('state', this.serialize());
  }

}

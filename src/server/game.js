'use strict';

const shortid = require('shortid');
const NanoTimer = require('nanotimer');
const log = require('./log');

module.exports = class Game {

  constructor(id, socket, server) {
    this.id = id || shortid.generate();
    this.server = server;
    this.players = new Map();
    this.running = false;
    this.updateTimer = new NanoTimer();
    this.broadcastTimer = new NanoTimer();
    this.socket = socket;
    this.tick = 0;
  }

  serialize() {
    return {
      id: this.id,
      tick: this.tick,
      players: Array.from(this.players.values()).map(p => p.serialize()),
    };
  }

  toString() {
    return `Game(${this.id},p#${this.players.size})`;
  }

  join(player) {
    this.players.set(player.id, player);
    log.info(`${player} joined ${this}`);
    player.join(this);
    if (!this.running) this.start();
  }

  leave(player) {
    this.players.delete(player.id);
    log.info(`${player} left ${this}`);
    if (this.players.size === 0) {
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
    this.broadcastTimer.clearInterval();
    this.server.closeGame(this);
  }

  update() {
    this.tick++;
    // do the world updates here
  }

  broadcast() {
    this.socket.to(this.id).emit('state', this.serialize());
  }

};
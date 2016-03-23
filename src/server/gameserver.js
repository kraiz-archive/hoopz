'use strict';

const Game = require('./game');
const Player = require('./player');
const log = require('./log');

module.exports = class GameServer {

  constructor(socket) {
    this.games = new Map();
    this.socket = socket;
    this.socket.on('connection', ps => this.onConnection(ps));
  }

  onConnection(playerSocket) {
    const player = new Player(playerSocket);
    playerSocket.on('join', data => this.onJoin(player, data));
    playerSocket.emit('connected', {
      you: player.serialize(),
      games: this.games.map(g => g.serialize()),
    });
  }

  onJoin(player, game) {
    if (this.games.length === 0 || game.id) { // no game exists or no preference
      this.getOrCreateGame(game.id).join(player);
    } else {
      this.games[0].join(player);
    }
  }

  getOrCreateGame(id) {
    let game = id ? this.games.find(g => g.id === id) : undefined;
    if (!game) {
      game = new Game(id, this.socket, this);
      this.games.push(game);
    }
    return game;
  }

  closeGame(game) {
    this.games.splice(this.games.findIndex(g => g.id === game.id), 1);
    log.info(`Deleted ${game}`);
  }

};

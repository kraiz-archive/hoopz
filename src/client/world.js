'use strict';

import Player from './player';

const PIXI = require('pixi.js');

export default class World {
  constructor() {
    this.stage = new PIXI.Container();
    this.players = new Map();
  }

  /**
   * world update from server arrived
   */
  onUpdate(state) {
    let player;
    for (const playerState of state.players) {
      player = this.players.get(playerState.id);
      if (!player) {
        player = new Player(playerState);
        this.players.set(player.id, player);
        this.stage.addChild(player.gui);
      }
      player.onUpdate(playerState);
    }
  }

  /**
   * client want to render, so interpolate based on current time
   */
  onFrame(time) {
    for (const player of this.players.values()) {
      player.onFrame(time);
    }
  }
}

'use strict';

import Victor from 'victor';

const PIXI = require('pixi.js');
const Lerp = require('../shared/interpolators').Lerp;
const StateBuffer = require('../shared/datastructures').StateBuffer;

export default class Player {

  constructor(state) {
    this.id = state.id;
    this.stateBuffer = new StateBuffer(5, new Lerp());
    this.onUpdate(state);
    this.gui = new PIXI.Graphics();
    this.gui.beginFill(0xFFFF00);
    this.gui.drawRect(100, 100, 20, 20);
  }

  toString() {
    return `Player(${this.id})`;
  }

  onUpdate(state) {
    this.stateBuffer.push(Victor.fromObject(state.pos));
  }

  onFrame(time) {
    const newPos = this.stateBuffer.get(time);
    this.gui.position.x = newPos.x;
    this.gui.position.y = newPos.y;
  }
}

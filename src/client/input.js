'use strict';

import GyroNorm from 'gyronorm';
import config from '../shared/config';

class Input {

  constructor() {
    this.side = 0;
  }

  serialize() {
    return {
      side: this.side,
    };
  }

  update() {
    // override this, sample the input device
  }

}

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  SPACE: 32,
  SHIFT: 65,
};

export class KeyboardInput extends Input {

  constructor() {
    super();
    this.pressed = new Map();
    window.addEventListener('keydown', event => this.pressed.set(event.keyCode), false);
    window.addEventListener('keyup', event => this.pressed.delete(event.keyCode), false);
  }

  update() {
    this.side = 0;
    let speed = config.client.input.speed.normal;
    if (this.pressed.get(KEY.SHIFT)) speed = config.client.input.speed.fast;
    if (this.pressed.get(KEY.LEFT)) this.side -= speed;
    if (this.pressed.get(KEY.RIGHT)) this.side += speed;
  }
}


export class AccelerometerInput extends Input {
  constructor() {
    super();
    this.gn = new GyroNorm();
  }
}

export default function AutoDetectInput(...theArgs) {
  if (window.orientation && window.DeviceOrientationEvent) {
    return new AccelerometerInput(...theArgs);
  }
  return new KeyboardInput(...theArgs);
}

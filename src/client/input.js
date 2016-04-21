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

  sample() {
    // override this, sample the input device
  }

}

const KEY = {
  LEFT: 37, A: 65,
  RIGHT: 39, D: 68,
  UP: 38, W: 87,
  SPACE: 32,
  SHIFT: 16, CTRL: 17,
};

export class KeyboardInput extends Input {

  constructor() {
    super();
    this.pressed = new Set();
    window.addEventListener('keydown', event => this.pressed.add(event.keyCode), false);
    window.addEventListener('keyup', event => this.pressed.delete(event.keyCode), false);
  }

  sample() {
    this.side = 0;
    let speed = config.client.input.speed.normal;
    if (this.pressed.has(KEY.SHIFT) || this.pressed.has(KEY.CTRL)) {
      speed = config.client.input.speed.fast;
    }
    if (this.pressed.has(KEY.LEFT) || this.pressed.has(KEY.A)) {
      this.side -= speed;
    }
    if (this.pressed.has(KEY.RIGHT) || this.pressed.has(KEY.D)) {
      this.side += speed;
    }
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

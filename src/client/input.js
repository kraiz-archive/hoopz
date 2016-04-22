'use strict';

import GyroNorm from 'gyronorm';
import config from '../shared/config';

class Input {

  sample() {
    // override this, sample the input device
    return {
      side: 0,
      jump: false,
    };
  }

}

const KEY = {
  LEFT: 37, A: 65,
  RIGHT: 39, D: 68,
  SPACE: 32, UP: 38, W: 87,
  SHIFT: 16, CTRL: 17,
};

export class KeyboardInput extends Input {

  constructor() {
    super();
    this.pressed = new Set();
    this.jumped = false;
    window.addEventListener('keydown', event => this.onKeyDown(event.keyCode), false);
    window.addEventListener('keyup', event => this.onKeyUp(event.keyCode), false);
  }

  onKeyDown(keyCode) {
    this.pressed.add(keyCode);
    if (keyCode === KEY.SPACE || keyCode === KEY.UP || keyCode === KEY.W) {
      this.jumped = true;
    }
  }

  onKeyUp(keyCode) {
    this.pressed.delete(keyCode);
  }

  sample() {
    let side = 0;
    let jump = false;
    let speed = config.client.input.speed.normal;
    if (this.pressed.has(KEY.SHIFT) || this.pressed.has(KEY.CTRL)) {
      speed = config.client.input.speed.fast;
    }
    if (this.pressed.has(KEY.LEFT) || this.pressed.has(KEY.A)) {
      side -= speed;
    }
    if (this.pressed.has(KEY.RIGHT) || this.pressed.has(KEY.D)) {
      side += speed;
    }
    if (this.jumped || this.pressed.has(KEY.SPACE) || this.pressed.has(KEY.UP) ||
        this.pressed.has(KEY.W)) {
      this.jumped = false;
      jump = true;
    }
    return { side, jump };
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

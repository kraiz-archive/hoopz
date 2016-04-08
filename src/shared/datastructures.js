'use strict';

module.exports.StateBuffer = class StateBuffer {
  constructor(size, interpolator) {
    this.size = size;
    this.buffer = [];
    this.interpolator = interpolator;
  }
  push(value) {
    const newElement = {
      value,
      time: Date.now(),
    };
    if (this.buffer.unshift(newElement) > this.size) {
      this.buffer.pop();
    }
  }

  get(time) {
    const idx = this.buffer.findIndex(e => e.time <= time);
    switch (idx) {
      case -1: // no values older than given time
        return null;
      case 0: // latest value, maybe extrapolate here?
        return this.buffer[idx].value;
      default:
        {
          const a = this.buffer[idx];
          const b = this.buffer[idx - 1];
          const t = 1 - (b.time - time) / (b.time - a.time);
          return this.interpolator.interpolate(a.value, b.value, t);
        }
    }
  }
};

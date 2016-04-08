'use strict';

/**
 * Interpolator interface.
 */
class Interpolator {
  /*  */
  /**
   * handle submit form event
   * @param {Victor} a source vector
   * @param {Victor} b target vector
   * @param {float} t distance scalar (0=a, 1=b)
   * @return {Victor} interpolated vector
   */
  interpolate(a, b, t) {} // eslint-disable-line
}

/**
 * Fast and simple interpolation.
 */
module.exports.NearestNeighbor = class NearestNeighbor extends Interpolator {
  interpolate(a, b, t) {
    return t <= 0.5 ? a : b;
  }
};

/**
 * Linear interpolation.
 */
module.exports.Lerp = class Lerp extends Interpolator {
  interpolate(a, b, t) {
    return a.clone().mix(b, t);
  }
};

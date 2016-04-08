'use strict';

const Victor = require('victor');
const NearestNeighbor = require('../src/shared/interpolators').NearestNeighbor;
const Lerp = require('../src/shared/interpolators').Lerp;

describe('NearestNeighbor', () => {
  const interp = new NearestNeighbor();

  const v1 = new Victor(100, 100);
  const v2 = new Victor(300, 300);
  const v3 = new Victor(100, 250);

  it('works', () => {
    expect(interp.interpolate(v1, v2, 0).toArray()).toEqual([100, 100]);
    expect(interp.interpolate(v1, v2, 0.49).toArray()).toEqual([100, 100]);
    expect(interp.interpolate(v1, v2, 0.5).toArray()).toEqual([100, 100]);
    expect(interp.interpolate(v1, v2, 0.51).toArray()).toEqual([300, 300]);
    expect(interp.interpolate(v1, v2, 1).toArray()).toEqual([300, 300]);
    expect(interp.interpolate(v2, v3, 0).toArray()).toEqual([300, 300]);
    expect(interp.interpolate(v3, v2, 1).toArray()).toEqual([300, 300]);
  });
});

describe('Lerp', () => {
  const interp = new Lerp();

  const v1 = new Victor(100, 100);
  const v2 = new Victor(300, 300);
  const v3 = new Victor(100, 240);

  it('works', () => {
    expect(interp.interpolate(v1, v2, 0).toArray()).toEqual([100, 100]);
    expect(interp.interpolate(v1, v2, 0.5).toArray()).toEqual([200, 200]);
    expect(interp.interpolate(v1, v2, 1).toArray()).toEqual([300, 300]);
    expect(interp.interpolate(v2, v3, 0.25).toArray()).toEqual([250, 285]);
    expect(interp.interpolate(v2, v3, 0.4).toArray()).toEqual([220, 276]);
  });
});

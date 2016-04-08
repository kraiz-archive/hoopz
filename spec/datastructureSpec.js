'use strict';

const StateBuffer = require('../src/shared/datastructures').StateBuffer;
const NearestNeighbor = require('../src/shared/interpolators').NearestNeighbor;

describe('StateBuffer', () => {
  jasmine.clock().install();

  const interp = new NearestNeighbor();
  let stateBuffer = null;
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(1000));

    spyOn(interp, 'interpolate').and.callThrough();

    stateBuffer = new StateBuffer(3, interp);
    stateBuffer.push(5);
    jasmine.clock().tick(10);
    stateBuffer.push(10);
    jasmine.clock().tick(10);
    stateBuffer.push(20);
    jasmine.clock().tick(50);
    stateBuffer.push(500);
  });

  it('eats all elements up to its capacity', () => {
    expect(stateBuffer.get(1010)).toBe(10);
    expect(stateBuffer.get(1020)).toBe(20);
    expect(stateBuffer.get(1070)).toBe(500);
  });

  it('forget elements older elements', () => {
    expect(stateBuffer.get(1000)).toBe(null);
  });

  it('get latest value for future requests', () => {
    expect(stateBuffer.get(1070)).toBe(500);
    expect(stateBuffer.get(1071)).toBe(500);
    expect(stateBuffer.get(9999)).toBe(500);
  });

  it('empty buffer requests return null', () => {
    jasmine.clock().mockDate(new Date(1000));
    const emptyStateBuffer = new StateBuffer(3, new NearestNeighbor());
    expect(emptyStateBuffer.get(1)).toBe(null);
    expect(emptyStateBuffer.get(100)).toBe(null);
    expect(emptyStateBuffer.get(9999)).toBe(null);
  });

  it('calculates correct interpolator param t', () => {
    stateBuffer.get(1010);
    stateBuffer.get(1015);
    stateBuffer.get(1030);
    stateBuffer.get(1070);
    expect(interp.interpolate).toHaveBeenCalledTimes(3);
    expect(interp.interpolate.calls.argsFor(0)).toEqual([10, 20, 0]);
    expect(interp.interpolate.calls.argsFor(1)).toEqual([10, 20, 0.5]);
    expect(interp.interpolate.calls.argsFor(2).slice(0, 2)).toEqual([20, 500]);
    expect(interp.interpolate.calls.argsFor(2)[2]).toBeCloseTo(0.2, 8);
  });
});

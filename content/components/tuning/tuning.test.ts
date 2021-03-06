import { stack, clamp, nearestPitch, maxFractionSize, powers, limitN, equivalence, generate } from './tuning';

test('generate', () => {
  expect(generate(3, 7, 12, 2)).toEqual([
    { position: 0, ratio: 1, power: 0 },
    { position: 1, ratio: 256 / 243, power: -5 },
    { position: 2, ratio: 9 / 8, power: 2 },
    { position: 3, ratio: 32 / 27, power: -3 },
    { position: 4, ratio: 81 / 64, power: 4 },
    { position: 5, ratio: 4 / 3, power: -1 },
    { position: 6, ratio: 729 / 512, power: 6 },
    { position: 7, ratio: 3 / 2, power: 1 },
    { position: 8, ratio: 128 / 81, power: -4 },
    { position: 9, ratio: 27 / 16, power: 3 },
    { position: 10, ratio: 16 / 9, power: -2 },
    { position: 11, ratio: 243 / 128, power: 5 },
  ])
})

test('limit', () => {
  expect(powers([[3, -1, 3]])).toEqual([
    [1 / 3, 1, 3, 9, 27]
  ])
  expect(powers([[3, 0, 2], [5, 0, 1]])).toEqual([
    [1, 3, 9],
    [1, 5]
  ])
  // currently does not seem to work with jest config
  /* expect(Combinatorics.cartesianProduct(
    [1, 3, 9],
    [1, 5]
  ).toArray()).toEqual([
    [1, 1], [3, 1], [9, 1], [1, 5], [3, 5], [9, 5]
  ]) */
  /* expect(limitN([[3, 0, 2], [5, 0, 1]])).toEqual([
    1, 3, 9, 5, 15, 45
  ]) */
  expect(equivalence(3, 2)).toEqual(3 / 2)
  expect(equivalence(1 / 3, 2)).toEqual(4 / 3)
  /* expect(limitN([[3, 0, 2], [5, 0, 1]])).toEqual([
    1, 3, 9, 5, 15, 45
  ])
  expect(limitN([[3, 0, 2], [5, 0, 1]], 2)).toEqual([
    1, 3 / 2, 9 / 8, 5 / 4, 15 / 8, 45 / 32
  ]) */
})

test('fraction', () => {
  expect(stack(1)).toEqual([440])
  expect(stack(2)).toEqual([440, 660])
  expect(stack(3)).toEqual([440, 660, 990])
  expect(stack(4)).toEqual([440, 660, 990, 1485])
  expect(stack(5)).toEqual([440, 660, 990, 1485, 2227.5])
});
test('clamp', () => {
  expect(clamp(1, 1)).toEqual(1);
  expect(clamp(2, 1)).toEqual(2);
  expect(clamp(3, 1)).toEqual(3 / 2);
  expect(clamp(4, 1)).toEqual(2);
  expect(clamp(5, 1)).toEqual(5 / 4);

  expect(clamp(990)).toEqual(495);
  expect(clamp(1485)).toEqual(742.5);
  expect(clamp(2227.5)).toEqual(556.875);
  expect(clamp(4 / 3, 1)).toEqual(4 / 3);
})
test('nearestPitch', () => {
  expect(nearestPitch(440)).toBe("A4");
  expect(nearestPitch(450)).toBe("A4");
  expect(nearestPitch(460)).toBe("Bb4");
})
test('maxFractionSize', () => {
  expect(maxFractionSize([4 / 3, 1, 2])).toEqual([4, 3]);
  expect(maxFractionSize([4 / 3, 5 / 9])).toEqual([5, 9]);
  expect(maxFractionSize([1, 2, 3, 4 / 3])).toEqual([4, 3]);
})

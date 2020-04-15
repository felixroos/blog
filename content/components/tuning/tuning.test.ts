import { stack, clamp, nearestPitch, maxFractionSize } from './tuning';

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

import { stack, clamp, nearestPitch } from './tuning';
import { Note } from '@tonaljs/tonal';

test('fraction', () => {
  expect(stack(1)).toEqual([440])
  expect(stack(2)).toEqual([440, 660])
  expect(stack(3)).toEqual([440, 660, 990])
  expect(stack(4)).toEqual([440, 660, 990, 1485])
  expect(stack(5)).toEqual([440, 660, 990, 1485, 2227.5])
  expect(clamp(990)).toEqual(495);
  expect(clamp(1485)).toEqual(742.5);
  expect(clamp(2227.5)).toEqual(556.875);
  expect(nearestPitch(440)).toBe("A4");
  expect(nearestPitch(450)).toBe("A4");
  expect(nearestPitch(460)).toBe("Bb4");
})
import { rhythmEvents } from './rhythmEvents';
import { stripEvent } from '../util';

test('rhythmEvents', () => {
  expect(rhythmEvents({ duration: 3, sequential: ['a', ['b', 'c'], 'd'] }).map(stripEvent)).toEqual([
    ["a", 0, 1],
    ["b", 1, 0.5],
    ["c", 1.5, 0.5],
    ["d", 2, 1],
  ])
  expect(rhythmEvents({ duration: 3, sequential: ['a', { parallel: ['b', 'c'] }, 'd'] }).map(stripEvent)).toEqual([
    ["a", 0, 1],
    ["b", 1, 1],
    ["c", 1, 1],
    ["d", 2, 1],
  ])
  expect(rhythmEvents({ duration: 4, sequential: ['a', { parallel: ['b', 'c'], duration: 2 }, 'd'] }).map(stripEvent)).toEqual([
    ["a", 0, 1],
    ["b", 1, 2],
    ["c", 1, 2],
    ["d", 3, 1],
  ]);
  expect(rhythmEvents({ duration: 4, sequential: [[0, 1, 0, 1], [0, 1, 0, 1]] }).map(stripEvent)).toEqual([
    [0, 0, 0.5],
    [1, 0.5, 0.5],
    [0, 1, 0.5],
    [1, 1.5, 0.5],
    [0, 2, 0.5],
    [1, 2.5, 0.5],
    [0, 3, 0.5],
    [1, 3.5, 0.5]
  ])
});

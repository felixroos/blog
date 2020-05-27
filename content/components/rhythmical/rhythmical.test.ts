import { unify, toObject, toArray, flatArray, getTimeDuration, flatRhythm, nestArray } from './rhythmical';

test('toObject', () => {
  expect(toObject('')).toEqual({ m: '' });
  expect(toObject('C')).toEqual({ m: 'C' });
  expect(toObject({ m: 'C' })).toEqual({ m: 'C' });
  expect(toObject(['C', 'D'])).toEqual({ m: ['C', 'D'] });
});
test('toArray', () => {
  expect(toArray('')).toEqual(['']);
  expect(toArray([])).toEqual([]);
  expect(toArray('C')).toEqual(['C']);
  expect(toArray({ m: 'C' })).toEqual([{ m: 'C' }]);
})
test('unify', () => {
  expect(unify('')).toEqual({ m: '' });
  expect(unify('C')).toEqual({ m: ['C'] });
  expect(unify({ m: 'C' })).toEqual({ m: ['C'] });
  expect(unify({ m: ['C', 'D'] })).toEqual({ m: ['C', 'D'] });
  expect(unify(['C', 'D'])).toEqual({ m: ['C', 'D'] });
  expect(unify({ p: ['C', 'D'] })).toEqual({ p: ['C', 'D'] });
});
test('flatArray', () => {
  expect(flatArray([])).toEqual([]);
  expect(flatArray(['C'])).toEqual([
    { value: 'C', path: [[0, 1, 1]] }
  ]);
  expect(flatArray(['C', 'D'])).toEqual([
    { value: 'C', path: [[0, 1, 2]] },
    { value: 'D', path: [[1, 1, 2]] }
  ]);
  expect(flatArray([{ value: 'C4', duration: 3 }, 'D4'])).toEqual([
    { value: 'C4', path: [[0, 3, 2]] },
    { value: 'D4', path: [[1, 1, 2]] }
  ]);
  expect(flatArray(['C', 'D', ['E', 'F']])).toEqual([
    { value: 'C', path: [[0, 1, 3]] },
    { value: 'D', path: [[1, 1, 3]] },
    { value: 'E', path: [[2, 1, 3], [0, 1, 2]] },
    { value: 'F', path: [[2, 1, 3], [1, 1, 2]] }]);
})
test('getTimeDuration', () => {
  expect(getTimeDuration([[0, 1, 2]])).toEqual([0, 0.5])
  expect(getTimeDuration([[1, 1, 2]])).toEqual([0.5, 0.5])
  expect(getTimeDuration([[0, 1, 2], [0, 1, 2]])).toEqual([0, 0.25])
  expect(getTimeDuration([[0, 1, 2], [1, 1, 2]])).toEqual([0.25, 0.25])
  expect(getTimeDuration([[1, 1, 2], [0, 2, 2]])).toEqual([0.5, 0.5])
})

test('flatRhythm', () => {
  expect(flatRhythm(['C', 'D'])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.5 },
  ])
  expect(flatRhythm(['C', ['D', 'E']])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.25 },
    { value: 'E', time: 0.75, duration: 0.25 },
  ])
})

test('nestArray', () => {
  expect(nestArray([])).toEqual([]);
  expect(nestArray([{ value: 'C', path: [[0, 1, 1]] }])).toEqual([
    'C'
  ]);
  expect(nestArray([
    { value: 'C', path: [[0, 1, 2]] },
    { value: 'D', path: [[1, 1, 2]] }
  ])).toEqual(['C', 'D']);

  expect(nestArray([
    { value: 'C', path: [[0, 1, 3]] },
    { value: 'D', path: [[1, 1, 3]] },
    { value: 'E', path: [[2, 1, 3], [0, 1, 2]] },
    { value: 'F', path: [[2, 1, 3], [1, 1, 2]] }]))
    .toEqual(['C', 'D', ['E', 'F']]);
})
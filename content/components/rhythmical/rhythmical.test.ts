import { getTimeDuration, flatRhythmObject } from './rhythmical';
import { flatRhythmArray } from './deprecated';
// import { flatRhythmObject } from './deprecated'; // also works, but bad code
import { toObject } from './helpers/objects';

test('getTimeDuration', () => {
  expect(getTimeDuration([[0, 1, 2]])).toEqual([0, 0.5])
  expect(getTimeDuration([[1, 1, 2]])).toEqual([0.5, 0.5])
  expect(getTimeDuration([[0, 1, 2], [0, 1, 2]])).toEqual([0, 0.25])
  expect(getTimeDuration([[0, 1, 2], [1, 1, 2]])).toEqual([0.25, 0.25])
  expect(getTimeDuration([[1, 1, 2], [0, 2, 2]])).toEqual([0.5, 0.5])
})

test('flatRhythmObject', () => {
  expect(flatRhythmObject('A')).toEqual([{ value: 'A', path: [[0, 1, 1]] }])
  expect(flatRhythmObject(['A', 'B'])).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2]] }])
  expect(flatRhythmObject(['A', ['B']])).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 1]] }])
  expect(flatRhythmObject(['A', ['B', 'C']])).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatRhythmObject({ value: ['A', ['B', 'C']] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatRhythmObject({ sequential: ['A', ['B', 'C']] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatRhythmObject({ sequential: ['A', { value: ['B', 'C'] }] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatRhythmObject({ sequential: ['A', { sequential: ['B', 'C'] }] })).toEqual([{ value: 'A', path: [[0, 1, 2]] }, { value: 'B', path: [[1, 1, 2], [0, 1, 2]] }, { value: 'C', path: [[1, 1, 2], [1, 1, 2]] }])
  expect(flatRhythmObject({ parallel: ['B', 'C'] })).toEqual([{ value: 'B', path: [[0, 1, 1]] }, { value: 'C', path: [[0, 1, 1]] }])
  expect(flatRhythmObject([{ parallel: ['A', 'B'] }])).toEqual([{ value: 'A', path: [[0, 1, 1], [0, 1, 1]] }, { value: 'B', path: [[0, 1, 1], [0, 1, 1]] }])

  // polyphony
  expect(flatRhythmObject({
    sequential: [
      { parallel: ['C3', 'E3'], color: 'white' },
      { parallel: ['D3', 'F3'], color: 'gray' },
      { parallel: ['E3', 'G3'], color: 'steelblue' }
    ]
  })).toEqual(
    [{ "value": "C3", "path": [[0, 1, 3], [0, 1, 1]], "color": "white" }, { "value": "E3", "path": [[0, 1, 3], [0, 1, 1]], "color": "white" }, { "value": "D3", "path": [[1, 1, 3], [0, 1, 1]], "color": "gray" }, { "value": "F3", "path": [[1, 1, 3], [0, 1, 1]], "color": "gray" }, { "value": "E3", "path": [[2, 1, 3], [0, 1, 1]], "color": "steelblue" }, { "value": "G3", "path": [[2, 1, 3], [0, 1, 1]], "color": "steelblue" }]
  );
  expect(flatRhythmObject({
    parallel: [
      { sequential: ['E3', 'F3', 'G3'], color: 'white' },
      { sequential: ['C3', 'D3', 'E3'], color: 'gray' }
    ]
  })).toEqual([{ "value": "E3", "path": [[0, 1, 1], [0, 1, 3]], "color": "white" }, { "value": "F3", "path": [[0, 1, 1], [1, 1, 3]], "color": "white" }, { "value": "G3", "path": [[0, 1, 1], [2, 1, 3]], "color": "white" }, { "value": "C3", "path": [[0, 1, 1], [0, 1, 3]], "color": "gray" }, { "value": "D3", "path": [[0, 1, 1], [1, 1, 3]], "color": "gray" }, { "value": "E3", "path": [[0, 1, 1], [2, 1, 3]], "color": "gray" }])

  expect(toObject({ parallel: 'C' })).toEqual({ parallel: 'C' });
  const twoChords = [
    { value: "C", path: [[0, 1, 2], [0, 1, 1]] },
    { value: "E", path: [[0, 1, 2], [0, 1, 1]] },
    { value: "G", path: [[0, 1, 2], [0, 1, 1]] },
    { value: "D", path: [[1, 1, 2], [0, 1, 1]] },
    { value: "F", path: [[1, 1, 2], [0, 1, 1]] },
    { value: "A", path: [[1, 1, 2], [0, 1, 1]] }
  ];

  expect(flatRhythmObject([
    { parallel: ['C', 'E', 'G'] },
    { parallel: ['D', 'F', 'A'] },
  ]
  )).toEqual(twoChords)

  expect(flatRhythmObject([
    { value: ['C', 'E', 'G'], type: 'parallel' },
    { value: ['D', 'F', 'A'], type: 'parallel' },
  ]
  )).toEqual(twoChords)
  expect(flatRhythmObject(['C', ['D', 'E']]))
    .toEqual([
      { value: "C", path: [[0, 1, 2]] },
      { value: "D", path: [[1, 1, 2], [0, 1, 2]] },
      { value: "E", path: [[1, 1, 2], [1, 1, 2]] }
    ])
  expect(flatRhythmObject([{ value: 'C', duration: 2 }, ['D', 'E']]))
    .toEqual([
      { value: "C", path: [[0, 2, 3]], duration: 2 },
      { value: "D", path: [[2, 1, 3], [0, 1, 2]] },
      { value: "E", path: [[2, 1, 3], [1, 1, 2]] }
    ])
  expect(flatRhythmObject({ duration: 2, value: [{ value: 'C', duration: 2 }, ['D', 'E']] }))
    .toEqual([
      { value: "C", path: [[0, 2, 3]], duration: 2 },
      { value: "D", path: [[2, 1, 3], [0, 1, 2]] },
      { value: "E", path: [[2, 1, 3], [1, 1, 2]] }
    ])
  expect(flatRhythmObject(
    { value: ['C', 'E', 'G'], type: 'parallel' },
  ))
    .toEqual([
      { value: "C", path: [[0, 1, 1]] },
      { value: "E", path: [[0, 1, 1]] },
      { value: "G", path: [[0, 1, 1]] }
    ])
  expect(flatRhythmObject(
    { parallel: ['C', 'E', 'G'] },
  ))
    .toEqual([
      { value: "C", path: [[0, 1, 1]] },
      { value: "E", path: [[0, 1, 1]] },
      { value: "G", path: [[0, 1, 1]] }
    ])

})

test('flatRhythmArray', () => {
  expect(flatRhythmArray(['C', 'D'])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.5 },
  ])
  expect(flatRhythmArray(['C', ['D', 'E']])).toEqual([
    { value: 'C', time: 0, duration: 0.5 },
    { value: 'D', time: 0.5, duration: 0.25 },
    { value: 'E', time: 0.75, duration: 0.25 },
  ])
})
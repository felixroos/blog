import { toObject, flatObject, toArray } from './objects';

test('toObject', () => {
  expect(toObject('')).toEqual({ value: '' });
  expect(toObject('C')).toEqual({ value: 'C' });
  expect(toObject({ m: 'C' })).toEqual({ m: 'C' });
  expect(toObject(['C', 'D'])).toEqual({ value: ['C', 'D'] });
  expect(toObject('C')).toEqual({ value: 'C' });
});


test('flatObject', () => {
  expect(flatObject(['C', ['D', 'E']]))
    .toEqual([
      { value: "C", path: [[0, 2]] },
      { value: "D", path: [[1, 2], [0, 2]] },
      { value: "E", path: [[1, 2], [1, 2]] }
    ])
  expect(flatObject(['C', ['D', 'E', ['F', 'G']]]))
    .toEqual([
      { value: "C", path: [[0, 2]] },
      { value: "D", path: [[1, 2], [0, 3]] },
      { value: "E", path: [[1, 2], [1, 3]] },
      { value: "F", path: [[1, 2], [2, 3], [0, 2]] },
      { value: "G", path: [[1, 2], [2, 3], [1, 2]] }
    ])
  expect(flatObject({ value: ['C', ['D', 'E']] }))
    .toEqual([
      { value: "C", path: [[0, 2]] },
      { value: "D", path: [[1, 2], [0, 2]] },
      { value: "E", path: [[1, 2], [1, 2]] }
    ])
  expect(flatObject(['C', { value: ['D', 'E'] }]))
    .toEqual([
      { value: "C", path: [[0, 2]] },
      { value: "D", path: [[1, 2], [0, 2]] },
      { value: "E", path: [[1, 2], [1, 2]] }
    ])
  expect(flatObject([{ value: 'C' }, { value: ['D', 'E'] }]))
    .toEqual([
      { value: "C", path: [[0, 2]] },
      { value: "D", path: [[1, 2], [0, 2]] },
      { value: "E", path: [[1, 2], [1, 2]] }
    ])
  expect(flatObject(['C', ['D', 'E']], {
    getChildren: (music, props): any => {
      let block = toObject(music)
      props.level = (props.level || 0) + 1;
      return (toArray(block.value) || [])
        .map(child => ({
          level: props.level - 1,
          ...toObject(child)
        }))
    }
  })).toEqual([
    { value: "C", level: 0 },
    { value: "D", level: 1 },
    { value: "E", level: 1 }
  ])
})
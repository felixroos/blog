import composeChords from './composeChords'

test('composeChords', () => {
  expect(composeChords(['C^7', ['Dm7', 'G7']], [[0, 1, 0, 1], [0, 1, 0, 1]]).map(({ value, time }) => [value])).toEqual([
    ['E3'],
    ['E3'],
    ['B3'],
    ['B3'],
    ['F3'],
    ['C4'],
    ['F3'],
    ['B3']
  ])
})
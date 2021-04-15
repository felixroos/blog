import { toTonalChord } from './toTonalChord'

test('toTonalChord', () => {
  expect(toTonalChord('C-7')).toEqual('Cm7');
})
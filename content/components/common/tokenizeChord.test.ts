import { tokenizeChord } from './tokenizeChord';

test('tokenizeChord', () => {
  expect(tokenizeChord('C-7')).toEqual(['C', '-7', undefined]);
  expect(tokenizeChord('C-7/Bb')).toEqual(['C', '-7', 'Bb']);
})
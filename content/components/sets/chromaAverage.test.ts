import { Note } from '@tonaljs/tonal';
import chromaAverage from './chromaAverage';
import scaleChroma from './scaleChroma';

test('chromaAverage', () => {
  // tested with dorian, as it is the harmonic "equilibrium" (see circle)
  expect(chromaAverage(scaleChroma('C dorian'))).toBe(Note.chroma('C'));
  expect(chromaAverage(scaleChroma('F dorian'))).toBe(Note.chroma('F'));
  expect(chromaAverage(scaleChroma('Bb dorian'))).toBe(Note.chroma('Bb'));
  expect(chromaAverage(scaleChroma('Eb dorian'))).toBe(Note.chroma('Eb'));
  expect(chromaAverage(scaleChroma('Ab dorian'))).toBe(Note.chroma('Ab'));
  expect(chromaAverage(scaleChroma('Db dorian'))).toBe(Note.chroma('Db'));
  expect(chromaAverage(scaleChroma('Gb dorian'))).toBe(Note.chroma('Gb'));
  expect(chromaAverage(scaleChroma('B dorian'))).toBe(Note.chroma('B'));
  expect(chromaAverage(scaleChroma('E dorian'))).toBe(Note.chroma('E'));
  expect(chromaAverage(scaleChroma('A dorian'))).toBe(Note.chroma('A'));
  expect(chromaAverage(scaleChroma('D dorian'))).toBe(Note.chroma('D'));
  expect(chromaAverage(scaleChroma('G dorian'))).toBe(Note.chroma('G'));
})
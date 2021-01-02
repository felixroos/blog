import { Note } from '@tonaljs/tonal';
import chromaAverage from './chromaAverage';
import reorderChroma from './reorderChroma';
import scaleChroma from './scaleChroma';

test('chromaAverage', () => {
  // tested with dorian, as it is the harmonic "equilibrium" (see circle)
  expect(chromaAverage(reorderChroma(scaleChroma('C dorian'), 7))).toBe(Note.chroma('C'));
  expect(chromaAverage(reorderChroma(scaleChroma('F dorian'), 7))).toBe(Note.chroma('F'));
  expect(chromaAverage(reorderChroma(scaleChroma('Bb dorian'), 7))).toBe(Note.chroma('Bb'));
  expect(chromaAverage(reorderChroma(scaleChroma('Eb dorian'), 7))).toBe(Note.chroma('Eb'));
  expect(chromaAverage(reorderChroma(scaleChroma('Ab dorian'), 7))).toBe(Note.chroma('Ab'));
  expect(chromaAverage(reorderChroma(scaleChroma('Db dorian'), 7))).toBe(Note.chroma('Db'));
  expect(chromaAverage(reorderChroma(scaleChroma('Gb dorian'), 7))).toBe(Note.chroma('Gb'));
  expect(chromaAverage(reorderChroma(scaleChroma('B dorian'), 7))).toBe(Note.chroma('B'));
  expect(chromaAverage(reorderChroma(scaleChroma('E dorian'), 7))).toBe(Note.chroma('E'));
  expect(chromaAverage(reorderChroma(scaleChroma('A dorian'), 7))).toBe(Note.chroma('A'));
  expect(chromaAverage(reorderChroma(scaleChroma('D dorian'), 7))).toBe(Note.chroma('D'));
  expect(chromaAverage(reorderChroma(scaleChroma('G dorian'), 7))).toBe(Note.chroma('G'));
})
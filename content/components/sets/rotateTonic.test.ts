import { Note, Scale } from '@tonaljs/tonal'
import allPitches from './allPitches'
import findCircularIndex from './findCircularIndex'
import relatedScale from './relatedScale'
import reorderChroma from './reorderChroma'
import rotateChroma from './rotateChroma'
import rotateTonic from './rotateTonic'
import scaleChroma from './scaleChroma'
import scaleModes from './scaleModes'

test('rotateTonic diatonic', () => {
  /* expect(rotateTonic(0, 'C major', scaleModes('major'))).toBe('C major')
  expect(rotateTonic(1, 'C major', scaleModes('major'))).toBe('D dorian')
  expect(rotateTonic(2, 'C major', scaleModes('major'))).toBe('E phrygian')
  expect(rotateTonic(3, 'C major', scaleModes('major'))).toBe('F lydian')
  expect(rotateTonic(4, 'C major', scaleModes('major'))).toBe('G mixolydian')
  expect(rotateTonic(5, 'C major', scaleModes('major'))).toBe('A aeolian')
  expect(rotateTonic(6, 'C major', scaleModes('major'))).toBe('B locrian')
  expect(rotateTonic(7, 'C major', scaleModes('major'))).toBe('C major') */

  const testRoot = (root) => {
    const scale = `${root} major`;
    const { notes } = Scale.get(scale);
    const scales = [
      'major',
      'dorian',
      'phrygian',
      'lydian',
      'mixolydian',
      'aeolian',
      'locrian',
      'major',
    ]
    for (let i = 0; i <= 7; ++i) {
      expect(rotateTonic(i, scale, scaleModes('major'))).toBe(`${notes[i % notes.length]} ${scales[i % notes.length]}`)
    }
  }
  allPitches.forEach(pitch => {
    testRoot(pitch);
  })
})


const harmonicTransposition = chroma => {
  const fifths = reorderChroma(chroma, 7);
  const rotated = rotateChroma(1, fifths);
  return reorderChroma(rotated, 7);
}

test('harmonicTransposition', () => {
  expect(harmonicTransposition(scaleChroma('C melodic minor'))).toBe(scaleChroma('F melodic minor'))
  expect(harmonicTransposition(scaleChroma('C melodic minor'))).toBe(scaleChroma('G dorian b2'))
})


/* const nextOne = (chroma, index) => {
  const rotated = Collection.rotate(index, chroma.split(''));
  return (rotated.slice(1).indexOf('1') + index + 1) % chroma.length;
} */
const nextOne = (chroma, index) => {
  return findCircularIndex(chroma.split(''), d => d === '1', index + 1);
}
test('nextOne', () => {
  expect(nextOne('101', 0)).toBe(2)
  expect(nextOne('101', 2)).toBe(0)
  expect(nextOne('10001', 4)).toBe(0)
  expect(nextOne('01001', 4)).toBe(1)
})


const nextRoot = (scale, step = 1, pc = Scale.get(scale).tonic) => {
  const { notes } = Scale.get(scale);
  const chroma = reorderChroma(scaleChroma(scale), step);
  const currentIndex = (Note.chroma(pc) * step) % 12;
  const nextIndex = (nextOne(chroma, currentIndex) * step) % 12
  return notes.find(note => Note.chroma(note) === nextIndex);
};

test('nextRoot', () => {
  expect(nextRoot('C major', 1)).toBe('D');
  expect(nextRoot('C major', 5)).toBe('F');
  expect(nextRoot('C major', 7)).toBe('G');
  expect(nextRoot('C major', 1, 'D')).toBe('E');
  expect(nextRoot('A locrian #2', 7)).toBe('B');

})

test('nextRelatedScale', () => {
  const nextRelatedScale = (scale, step = 1) => {
    return relatedScale(scale, nextRoot(scale, step));
  }
  expect(nextRelatedScale('A locrian #2', 7)).toBe('B altered')
})
import chordScales from './chordScales'
import scaleModes from './scaleModes'

test('chordScales', () => {
  expect(chordScales('m7', scaleModes('major'))).toEqual(['phrygian', 'aeolian', 'dorian'])
  expect(chordScales('m7', ['minor', 'dorian', 'major'])).toEqual(['minor', 'dorian'])
  expect(chordScales('^7', ['minor', 'dorian', 'major'])).toEqual(['major'])
})
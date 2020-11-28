import rotateScale from './rotateScale'
import scaleModes from './scaleModes'

test('rotateScale C', () => {

  expect(rotateScale(1, 'C major', scaleModes('major'))).toBe('C dorian');
  expect(rotateScale(2, 'C major', scaleModes('major'))).toBe('C phrygian');
  expect(rotateScale(3, 'C major', scaleModes('major'))).toBe('C lydian');
  expect(rotateScale(4, 'C major', scaleModes('major'))).toBe('C mixolydian');
  expect(rotateScale(5, 'C major', scaleModes('major'))).toBe('C aeolian');
  expect(rotateScale(6, 'C major', scaleModes('major'))).toBe('C locrian');
  expect(rotateScale(7, 'C major', scaleModes('major'))).toBe('C major');
})

test('rotateScale G', () => {
  expect(rotateScale(1, 'G major', scaleModes('major'))).toBe('G dorian');
  expect(rotateScale(2, 'G major', scaleModes('major'))).toBe('G phrygian');
  expect(rotateScale(3, 'G major', scaleModes('major'))).toBe('G lydian');
  expect(rotateScale(4, 'G major', scaleModes('major'))).toBe('G mixolydian');
  expect(rotateScale(5, 'G major', scaleModes('major'))).toBe('G aeolian');
  expect(rotateScale(6, 'G major', scaleModes('major'))).toBe('G locrian');
  expect(rotateScale(7, 'G major', scaleModes('major'))).toBe('G major');
})
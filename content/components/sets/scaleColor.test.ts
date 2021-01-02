import scaleColor from './scaleColor'

test('scaleColor', () => {
  expect(scaleColor('C dorian')).toBe('rgb(255, 64, 64)')
  expect(scaleColor('F dorian')).toBe('rgb(238, 17, 127)')
  expect(scaleColor('Bb dorian')).toBe('rgb(191, 0, 191)')
  expect(scaleColor('Eb dorian')).toBe('rgb(127, 17, 238)')
  expect(scaleColor('Ab dorian')).toBe('rgb(64, 64, 255)')
  expect(scaleColor('Db dorian')).toBe('rgb(17, 127, 238)')
  expect(scaleColor('Gb dorian')).toBe('rgb(0, 191, 191)')
  expect(scaleColor('B dorian')).toBe('rgb(17, 238, 128)')
  expect(scaleColor('E dorian')).toBe('rgb(64, 255, 64)')
  expect(scaleColor('A dorian')).toBe('rgb(127, 238, 17)')
  expect(scaleColor('D dorian')).toBe('rgb(191, 191, 0)')
  expect(scaleColor('G dorian')).toBe('rgb(238, 128, 17)')
  expect(scaleColor('G melodic minor')).toBe('rgb(191, 191, 0)'); // like d dorian
})
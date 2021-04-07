import scaleModes from '../scaleModes'

test('scaleModes', () => {
  expect(scaleModes('major')).toEqual([
    "lydian",
    "locrian",
    "phrygian",
    "aeolian",
    "dorian",
    "mixolydian",
    "major",
  ])
  expect(scaleModes('harmonic minor')).toEqual([
    "harmonic minor",
    "ultralocrian",
    "locrian 6",
    "romanian minor",
    "dorian #4",
    "phrygian dominant",
    "major augmented",
    "lydian #9",
  ])
  expect(scaleModes('major', 'harmonic minor')).toEqual([
    "harmonic minor",
    "lydian",
    "locrian",
    "ultralocrian",
    "locrian 6",
    "romanian minor",
    "dorian #4",
    "phrygian",
    "phrygian dominant",
    "aeolian",
    "dorian",
    "mixolydian",
    "major",
    "major augmented",
    "lydian #9",
  ])
})
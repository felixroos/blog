import scaleModes from '../sets/scaleModes';
import bestChordScales from './bestChordScales';

test('bestChordScales', () => {
  expect(bestChordScales(['Dm7', 'G7', 'C^7'], scaleModes('major'))).toEqual(['D dorian', 'G mixolydian', 'C major']);

  const attyaChords = ['Fm7', 'Bbm7', 'Eb7', 'Ab^7', 'Db^7', 'Dm7', 'G7', 'C^7', 'C^7', 'Cm7', 'Fm7', 'Bb7', 'Eb^7', 'Ab^7', 'Am7', 'D7', 'G^7', 'G^7', 'Am7', 'D7', 'G^7', 'G^7', 'F#h7', 'B7b9', 'E^7', 'C7b13', 'Fm7', 'Bbm7', 'Eb7', 'Ab^7', 'Db^7', 'Db-^7', 'Cm7', 'Bo7', 'Bbm7', 'Eb7', 'Ab^7', 'Gh7', 'C7b9'];
  expect(bestChordScales(attyaChords)).toEqual(
    [
      "F aeolian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "Db lydian",
      "D dorian",
      "G mixolydian",
      "C major",
      "C major",
      "C aeolian",
      "F dorian",
      "Bb mixolydian",
      "Eb major",
      "Ab lydian",
      "A dorian",
      "D mixolydian",
      "G major",
      "G major",
      "A dorian",
      "D mixolydian",
      "G major",
      "G major",
      "F# locrian",
      "B phrygian dominant",
      "E lydian",
      "C altered",
      "F aeolian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "Db lydian",
      "Db- lydian",
      "C phrygian",
      "B ultralocrian",
      "Bb dorian",
      "Eb mixolydian",
      "Ab major",
      "G locrian",
      "C phrygian dominant",
    ]
  );
})
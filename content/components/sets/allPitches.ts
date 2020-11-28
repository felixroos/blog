import { Range, Note } from '@tonaljs/tonal'

export default Range.chromatic(['C3', 'B3'], { sharps: true })
  .concat(Range.chromatic(['C3', 'B3']))
  .filter((note, i, a) => a.indexOf(note) === i)
  .sort((a, b) => Note.midi(a) - Note.midi(b)).map(note => Note.get(note).pc)
import { curry } from 'ramda';
import { editLeaf, walkRhythmLeafs } from '../RhythmZipper';
import { Note } from '@tonaljs/tonal';


export const transpose = curry((interval, rhythm) => walkRhythmLeafs(
  editLeaf(leaf => Note.midi(leaf) ? Note.transpose(leaf, interval) : leaf),
  rhythm
))

export default transpose;

export const transposeEvent = curry((interval, { value, transpose, ...event }) => ({
  ...event,
  value: Note.midi(value) ? Note.transpose(value, interval) : value,
}));

export const transposeEvents = curry((interval, events) =>
  events.map(transposeEvent(interval)))

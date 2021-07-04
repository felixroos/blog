import { Chord } from '@tonaljs/tonal';

export default function getBassNote(chord) {
  let root;
  if (chord?.split("/").length > 1) {
    root = chord?.split("/")[1];
  } else {
    root = Chord.tokenize(chord)[0];
  }
  return root + "2";
}
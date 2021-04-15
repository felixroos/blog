import { tokenizeChord } from './tokenizeChord';
import { toTonalChordSymbol } from './toTonalChordSymbol';

export function toTonalChord(chord) {
  const [root, symbol] = tokenizeChord(chord);
  return root + toTonalChordSymbol(symbol);
}
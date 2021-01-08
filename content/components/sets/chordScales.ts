import { Scale, PcSet, Chord } from '@tonaljs/tonal'

export default (chord, scales = Scale.names(), includeRoot = false) => {
  const isSuperSet = PcSet.isSupersetOf(Chord.get(chord).chroma);
  const matches = scales.filter((scale) => isSuperSet(Scale.get(scale).chroma));
  if (!includeRoot) {
    return matches
  }
  const [root] = Chord.tokenize(chord);
  return matches.map(scale => `${root} ${scale}`);
}
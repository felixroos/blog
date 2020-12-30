import { Scale, PcSet, Chord } from '@tonaljs/tonal'

export default (chord, scales = Scale.names()) => {
  const isSuperSet = PcSet.isSupersetOf(Chord.get(chord).chroma);
  return scales.filter((scale) => isSuperSet(Scale.get(scale).chroma));
}
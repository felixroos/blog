import { PcSet, Scale } from '@tonaljs/tonal';

export default (scale) => PcSet.get(Scale.get(scale).notes).chroma;
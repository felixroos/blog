import { Collection, Note, Scale } from '@tonaljs/tonal';
import rotateChroma from './rotateChroma';
import scaleChroma from './scaleChroma';

export default (amount, scale, scaleTypes = Scale.names()) => {
  const { tonic, chroma } = Scale.get(scale);
  //const rotated = rotateChroma(amount, scaleChroma(scale));
  const rotatedChroma = rotateChroma(amount, chroma);
  const rotated = Collection.rotate(12 - Note.get(tonic).chroma, rotatedChroma.split('')).join('');
  const type = scaleTypes.find((type) => scaleChroma(`${tonic} ${type}`) === rotated);
  return type ? `${tonic} ${type}` : '';
};
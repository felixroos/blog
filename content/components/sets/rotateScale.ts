import { Collection, Note, Scale } from '@tonaljs/tonal';
import chromaScale from './chromaScale';
import rotateChroma from './rotateChroma';

// keep root and scale shape, rotate around root
export default (n, scale, scaleTypes = Scale.names()) => {
  const { tonic, chroma } = Scale.get(scale);
  const rotatedChroma = rotateChroma(n, chroma);
  const rotated = Collection.rotate(12 - Note.get(tonic).chroma, rotatedChroma.split('')).join('');
  return chromaScale(rotated, tonic, scaleTypes);
};
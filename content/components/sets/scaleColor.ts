import reorderChroma from './reorderChroma';
import scaleChroma from './scaleChroma';
import chromaColor from './chromaColor';
import { TinyColor } from '@ctrl/tinycolor';

export default (scale) => {
  return new TinyColor(chromaColor(reorderChroma(scaleChroma(scale), 7))).desaturate(20).lighten(20).toHexString();
};

import reorderChroma from './reorderChroma';
import scaleChroma from './scaleChroma';
import { interpolateWarm, interpolateSinebow } from 'd3-scale-chromatic';
import { color } from 'd3-color';

function averageIndex(chroma) {
  const digits = chroma.split('');
  const ones = digits.reduce((indices, digit, index) => indices.concat(digit === '1' ? [index] : []), []);
  return ones.reduce((sum, i) => i + sum, 0) / 12;
}

export const binaryToHexColor = (binary) => {
  const hex = parseInt(binary, 2).toString(16).toUpperCase();
  const zeroes = new Array(3 - hex.length).fill(0).join('');
  return (
    '#' +
    (zeroes + hex)
      .split('')
      .map((d) => `${d}0`)
      .join('')
  );
};

/* export default (scale) => {
  const harmonicChroma = reorderChroma(scaleChroma(scale), 7);
  const avg = averageIndex(harmonicChroma);
  console.log('avg', avg, scale, harmonicChroma);
  const rgb = interpolateSinebow(avg / 12)
  return color(rgb).formatHex();
}; */

export default (scale) => {
  return binaryToHexColor(reorderChroma(scaleChroma(scale), 7));
};

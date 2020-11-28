import { Collection } from '@tonaljs/tonal';

export default function rotateChroma(amount, chroma) {
  const digits = chroma.split('');
  const ones = digits.reduce((indices, digit, index) => indices.concat(digit === '1' ? [index] : []), []);
  const rotation = ones[(amount + ones.length) % ones.length];
  return Collection.rotate(rotation, digits).join('');
};
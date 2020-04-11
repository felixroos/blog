import { Range, Note } from '@tonaljs/tonal'
import { TinyColor } from '@ctrl/tinycolor';
import { interpolateRainbow } from "d3-scale-chromatic"
import Fraction from "fraction.js"

export function partials([min, max], base = 440) {
  const f = [];
  for (let i = min; i <= max; ++i) {
    if (![0, -1].includes(i)) {
      f.push(base * (i < 0 ? -(1 / i) : i));
    }
  }
  return f.filter((f, i, a) => a.indexOf(f) === i)
}

export function frequencyColor(frequency) {
  const fraction = Math.log(frequency / 440) / Math.log(2)
  return new TinyColor(interpolateRainbow(fraction % 1))
    .lighten(20)
    .toHexString()
}

// stacks n partials by a fixed interval (factor) ontop of each other
export function stack(n, factor = 3 / 2, base = 440) {
  const f = [base];
  for (let i = 1; i < n; ++i) {
    f.push(f[f.length - 1] * factor)
  }
  return f;
}

// divides a frequency by 2 until it is inside one octave above the base
export function clamp(frequency, base = 440) {
  if (frequency > base * 2) {
    return clamp(frequency / 2, base);
  }
  if (frequency < base) {
    return clamp(frequency * 2, base);
  }
  return frequency
}

export function nearestPitch(frequency) {
  const delta = (f1, f2) => Math.abs(f1 - f2)
  return Range.chromatic(["C0", "C8"])
    .map(note => ({ note, freq: Note.freq(note) }))
    .reduce(
      (best: any, note: any) => {
        const delta = Math.abs(frequency - note.freq)
        return !best || delta < best.delta ?
          { ...note, delta } : best
      },
      { note: "no_match", freq: 0, delta: Infinity }).note
}

export function maxFractionSize(floats) {
  return floats.reduce(
    ([maxCols, maxRows], float) => {
      const fraction = new Fraction(float).toFraction().split("/");
      return [
        Math.max(parseInt(fraction[0]), maxCols),
        Math.max(fraction[1] ? parseInt(fraction[1]) : 1, maxRows),
      ]
    },
    [0, 0]
  )
}

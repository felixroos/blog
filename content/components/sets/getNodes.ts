import { Note, Range } from '@tonaljs/tonal';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { TinyColor } from '@ctrl/tinycolor';

export default function getNodes(notes, pitches = [], tonic?) {
  const stroke = 'steelblue';
  const strokeWidth = 3;
  const t = pitches.indexOf(pitches.find(n => Note.get(n).chroma === Note.get(tonic).chroma));
  const absoluteColor = (i, match) => new TinyColor(interpolateRainbow(((i + 3) % notes.length) / notes.length)).lighten(20).toHexString()
  const relativeColor = (i, match) => new TinyColor(interpolateRainbow(((pitches.indexOf(match) + 3 + t) % pitches.length) / notes.length)).lighten(20).toHexString()
  return notes.map((pc, i, pcs) => {
    const match = (pitches || []).find((p) => Note.get(p).chroma === Note.get(pc).chroma);
    const isTonic = tonic && Note.get(tonic).chroma === Note.get(pc).chroma;

    return {
      id: Note.get(pc).chroma,
      label: match ? match : Note.get(pc).pc,
      value: i / pcs.length,
      style: isTonic ? { stroke, strokeWidth } : {},
      fill: match
        ? absoluteColor(i, match)
        : 'rgba(255,255,255,0.5)',
    };
  });
}
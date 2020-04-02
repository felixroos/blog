import { TinyColor } from "@ctrl/tinycolor"
import { Note } from "@tonaljs/tonal"
import { interpolateRainbow, interpolateSinebow, interpolateWarm } from 'd3-scale-chromatic'

export function noteColor(note: string, rotate = 0): TinyColor {
  return new TinyColor({
    h: Math.floor((rotate + (Note.chroma(note) / 12) * 360) % 360),
    s: 100,
    l: 50,
  })
}

export function noteLightness(note: string, offset = 50, factor = 2) {
  return (Note.midi(note) - offset) * factor;
}

export function rainbow(note: string, rotate = 180) {
  return new TinyColor(interpolateRainbow(Note.chroma(note) / 12 + rotate / 360))
}
export function sinebow(note: string, rotate = 180) {
  return new TinyColor(interpolateSinebow(Note.chroma(note) / 12) + rotate / 360)
}

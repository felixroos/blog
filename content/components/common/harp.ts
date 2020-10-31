import * as Tone from 'tone';
import canUseDOM from '../canUseDOM';

export const { PolySynth, Synth } = Tone;

export const harp =
  canUseDOM() &&
  new PolySynth(6, Synth, {
    volume: -16,
    envelope: { attack: 0.01, decay: 2, sustain: 0, release: 0.1 },
    oscillator: { type: 'fmtriangle' },
  }).toMaster();
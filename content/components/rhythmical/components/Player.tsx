import React from 'react';
import { ValueChild } from '../helpers/objects';
import * as Tone from 'tone';
import canUseDOM from '../../canUseDOM';
import { max } from 'd3-array';
import { useState } from 'react';
import PianoRoll from './PianoRoll';
import PlayButton from './PlayButton';
const { PolySynth, Synth } = Tone;

export const synth =
  canUseDOM() &&
  new PolySynth(6, Synth, {
    volume: -16,
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.1 },
    oscillator: { type: 'fmtriangle' }
  }).toMaster();

export function playEvents(
  events: ValueChild<string>[],
  config: {
    duration?: number;
    instrument?;
    instruments?: any[];
  } = {}
) {
  let {
    instruments = { synth },
    duration = max(events.map((e) => e.time + e.duration))
  } = config;
  const part = new Tone.Part((time, event) => {
    if (event.value === 'r') {
      return;
    }
    pickInstrument(event.instrument, instruments).triggerAttackRelease(
      event.value,
      event.duration,
      time
    );
  }, events).start(0);
  part.loop = true;
  part.loopEnd = duration;
  Tone.Transport.start('+0.1');
  return part;
}

function pickInstrument(instrumentKey, instruments) {
  const availableInstruments = Object.keys(instruments);
  if (!availableInstruments.length) {
    console.warn('no instruments set!');
  }
  instrumentKey = instrumentKey || availableInstruments[0];
  let instrument;
  const match = availableInstruments.find((key) => key === instrumentKey);
  if (match) {
    instrument = instruments[match];
  } else {
    const fallback = availableInstruments[0];
    console.warn(
      'instrument ' +
        instrumentKey +
        ' was not added to player. using ' +
        fallback +
        ' as fallback'
    );
    instrument = instruments[fallback] || synth;
  }
  return instrument;
}

export function drawCallback(callback, grain = 1 / 30) {
  if (callback) {
    return new Tone.Loop((time) => {
      Tone.Draw.schedule(() => callback(Tone.Transport.seconds), time);
    }, grain).start(0);
  }
}

export default function Player(props) {
  const [time, setTime] = useState(0);
  return (
    <>
      <PianoRoll {...props} time={time} />
      <PlayButton {...props} draw={setTime} />
    </>
  );
}

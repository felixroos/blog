import canUseDOM from "../canUseDOM"
import { useReducer, useMemo } from 'react'
import * as Tone from "tone"
const { PolySynth, Synth } = Tone
/* Tone.context.latencyHint = 'balanced' */

interface SynthAction {
  type?: string,
  notes?: Tone.Frequency[],
  time?: Tone.Time,
  velocity?: number | number[],
};
/* 
var reverb = canUseDOM() && new Tone.Reverb({
  decay: 0.8,
  preDelay: 0.02,
  wet: 0.6,
}
).toMaster();
if (reverb) {
  reverb.generate()//
}

const defaultSynth =
  canUseDOM() &&
  new PolySynth(6, Synth, {
    volume: -6,
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.04,
      decay: 2,
      sustain: 0,
      release: 0.04
    },
  }).connect(reverb)

console.log('synth..'); */

export default function useSynth(props: { synth?: Tone.Monophonic, options?: any } = {}) {
  let { synth, options } = props;
  synth = synth /* || defaultSynth */ || useMemo(() => {
    return canUseDOM() &&
      new PolySynth(6, Synth, options || {
        volume: -12,
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.01,
          decay: 0.01,
          sustain: 1,
          release: 0.01
        }
      }).toMaster()
  }, []);
  const [state, dispatch] = useReducer(
    (state, action: SynthAction) => {
      const { type, notes, time, velocity } = { time: "+0.01", velocity: 1, ...action };

      function attackWithVelocity(notes: Tone.Frequency[], time: Tone.Time, velocity: number | number[] = 1) {
        if (typeof velocity === 'number') {
          synth.triggerAttack(notes, time, velocity)
        } else {
          notes.forEach((n, i) => velocity[i] && synth.triggerAttack([n], time, velocity[i]))
        }
      }
      switch (type) {
        case "ATTACK":
          attackWithVelocity(notes, time, velocity)
          return { ...state, notes: state.notes.concat(notes) }
        case "RELEASE":
          synth.triggerRelease(notes, time)
          return {
            ...state,
            notes: state.notes.filter((n) => !notes.includes(n)),
          }
        case "RELEASE_ALL":
          synth.releaseAll();
          return {
            ...state,
            notes: [],
          }
        case "SET_NOTES":
          synth.releaseAll();
          attackWithVelocity(notes, time, velocity)
          /* const attack = notes.filter(n => !state.notes.includes(n));
          const release = state.notes.filter(n => !notes.includes(n));
          if (attack.length > 0) { attackWithVelocity(attack, time, velocity) }
          if (release.length > 0) { synth.triggerRelease(release, time) } */
          return {
            ...state,
            notes
          }
        default:
          return state
      }
    },
    { notes: [] },
  )
  return {
    attack: (action: SynthAction) => dispatch({ type: "ATTACK", ...action }),
    release: (action: SynthAction) => dispatch({ type: "RELEASE", ...action }),
    releaseAll: () => dispatch({ type: "RELEASE_ALL" }),
    setNotes: (action: SynthAction) => dispatch({ type: "SET_NOTES", ...action }),
    notes: state.notes,
    synth
  }
}
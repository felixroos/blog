import canUseDOM from "../canUseDOM"
import { useReducer, useEffect } from 'react'
import * as Tone from "tone"
const { PolySynth, Synth } = Tone

interface SynthAction {
  type?: string,
  notes?: Tone.Frequency[],
  time?: Tone.Time,
  velocity?: number | number[],
};

var reverb = canUseDOM() && new Tone.Reverb({
  decay: 0.5,
  preDelay: 0.02,
  wet: 0.5,
}
).toMaster();
if (reverb) {
  reverb.generate()/* .then((r) => console.log('reverb ready', r)); */
}

const defaultSynth =
  canUseDOM() &&
  new PolySynth(12, Synth, {
    volume: -12,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0.1
    }
  }).connect(reverb)

export default function useSynth(synth: Tone.Monophonic = defaultSynth) {
  const [state, dispatch] = useReducer(
    (state, action: SynthAction) => {
      const { type, notes, time, velocity } = { time: "+0", velocity: 1, ...action };

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
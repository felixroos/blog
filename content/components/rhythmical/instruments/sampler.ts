
import { Distance, Interval, Note } from 'tonal';
import Tone from 'tone';

export function sampler(samples, options = {}) {
  // console.log('init sampler samples: ', samples.length);
  options = { volume: -12, attack: 0.01, ...options }
  let sampler = new Tone.Sampler(samples, options);
  const s = {
    triggerAttackRelease: (note, duration, time, velocity) => {
      if (typeof note === 'number') {
        sampler.triggerAttackRelease(note, duration, time);
        return;
      }
      if (options['transpose']) {
        note = Distance.transpose(note, Interval.fromSemitones(options['transpose']));
      }
      sampler.triggerAttackRelease(Note.simplify(note), duration, time, velocity);
    },
    triggerAttack: sampler.triggerAttack,
    triggerRelease: sampler.triggerAttack,
    connect: (dest) => { sampler.connect(dest); return s },
    toMaster: () => { sampler.toMaster(); return s },
  }
  return s;
}
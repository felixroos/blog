import { Chord } from '@tonaljs/tonal';
import { ValueChild } from './helpers/objects';

export function tieReducer(events: ValueChild<string>[], event: ValueChild<string>, index: number, array: ValueChild<string>[]): ValueChild<string>[] {
  // check if next event is a tie
  if (index + 1 < array.length && array[index + 1].value === '_') {
    return events.concat([
      { ...event, duration: event.duration + array[index + 1].duration }
    ]); // adds duration of next event to current
  }
  if (event.value === '_') {
    return events; // ignore tie
  }
  return events.concat([event]); // next event is no tie
}


export function chordReducer(events: ValueChild<string>[], event: ValueChild<string>, index: number, array: ValueChild<string>[]): ValueChild<string>[] {
  if (typeof event.value === 'string') {
    const { notes } = Chord.get(event.value);
    return events.concat(notes.map(note => ({ ...event, value: note + '3' })));
  }
  return events;
}
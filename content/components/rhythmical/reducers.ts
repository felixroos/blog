import { Harmony } from './../../drafts/voicing/Harmony';
import { ValueChild } from './helpers/objects';

export type EventReducer = (events: ValueChild<string>[], event: ValueChild<string>, index: number, array: ValueChild<string>[]) => ValueChild<string>[];
export type EventFilter = (event: ValueChild<string>, index: number, array: ValueChild<string>[]) => boolean;


export const tieReducer: (filter?: EventFilter) => EventReducer = (filter) => (events, event, index, array) => {
  // check if next event is a tie
  if (filter) {
    array = array.filter(filter);
  }
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

export const bassNotes: EventReducer = (events, event, index, array) => {
  if (typeof event.value !== 'string') {
    return events;
  }
  const bassNote = Harmony.getBassNote(event.value);
  return events.concat([{ ...event, value: bassNote + '2' }]);
}

export const parallel: (reducers: EventReducer[]) => EventReducer = (reducers) => {
  return (events, event, index, array) => {
    reducers.forEach(r => {
      events = r(events, event, index, array);
    })
    return events;
  }
}

export const track: (track: string, reducer: EventReducer) => EventReducer = (track, reducer = idleReducer) => {
  const trackFilter = ({ track: t }) => t === track;
  return (events, event, ...args) => {
    return trackFilter(event as any) ? reducer(events, event, ...args) : events;
  }
}

export const idleReducer: EventReducer = (events, event) => events.concat([event]);

export const applyReducers: (keepEventsWithoutReducer: boolean) => EventReducer = (keepEventsWithoutReducer = true) => (events, event, ...args) => {
  if (event.reducer) {
    events = event.reducer(events, event, ...args)
  }
  if (keepEventsWithoutReducer) {
    return events.concat([event]);
  }
  return events;
};
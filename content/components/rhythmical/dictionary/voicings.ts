import { Chord, Range, Note, Interval } from '@tonaljs/tonal';

export const lefthand = {
  m7: ['3m 5P 7m 9M', '7m 9M 10m 12P'],
  '7': ['3M 6M 7m 9M', '7m 9M 10M 13M'],
  '^7': ['3M 5P 7M 9M', '7M 9M 10M 12P'],
  '69': ['3M 5P 6A 9M'],
  'm7b5': ['3m 5d 7m 8P', '7m 8P 10m 12d'],
  '7b9': ['3M 6m 7m 9m', '7m 9m 10M 13m'], // b9 / b13
  '7b13': ['3M 6m 7m 9m', '7m 9m 10M 13m'], // b9 / b13
  'o7': ['1P 3m 5d 6M', '5d 6M 8P 10m'],
  '7#11': ['7m 9M 11A 13A'],
  '7#9': ['3M 7m 9A'],
  'mM7': ['3m 5P 7M 9M', '7M 9M 10m 12P'],
  'm6': ['3m 5P 6M 9M', '6M 9M 10m 12P'],
}

export const triads = {
  M: ['1P 3M 5P', '3M 5P 8P', '5P 8P 10M'],
  m: ['1P 3m 5P', '3m 5P 8P', '5P 8P 10m'],
}

export function enharmonicEquivalent(note: string, pitchClass: string): string {
  const { alt, letter } = Note.get(pitchClass);
  let { oct } = Note.get(note);
  const letterChroma = Note.chroma(letter) + alt;
  if (letterChroma > 11) {
    oct--;
  } else if (letterChroma < 0) {
    oct++;
  }
  return pitchClass + oct;
}

/*
console.log('C2 =', enharmonicEquivalent('C2', 'B#')) // B#1;
console.log('Cb3 =', enharmonicEquivalent('Cb2', 'B')) // B2;
console.log('F3 =', enharmonicEquivalent('F3', 'A#')); // A#3 
*/

export function voicingsInRange(chord, dictionary = lefthand, range = ['D3', 'A4']) {
  const { tonic, aliases } = Chord.get(chord);
  // find equivalent symbol that is used as a key in dictionary:
  const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
  if (!dictionary[symbol]) {
    return [];
  }
  // resolve array of interval arrays for the wanted symbol
  const voicings = dictionary[symbol].map(intervals => intervals.split(' '));
  const notesInRange = Range.chromatic(range) // gives array of notes inside range
  return voicings.reduce((voiced, voicing) => {
    // transpose intervals relative to first interval (e.g. 3m 5P > 1P 3M)
    const relativeIntervals = voicing.map(interval => Interval.substract(interval, voicing[0]));
    // get enharmonic correct pitch class the bottom note
    const bottomPitchClass = Note.transpose(tonic, voicing[0]);
    // get all possible start notes for voicing
    const starts = notesInRange
      // only get the start notes:
      .filter(note => Note.chroma(note) === Note.chroma(bottomPitchClass))
      // filter out start notes that will overshoot the top end of the range
      .filter(note => Note.midi(Note.transpose(note, relativeIntervals[relativeIntervals.length - 1])) <= Note.midi(range[1]))
      // replace Range.chromatic notes with the correct enharmonic equivalents
      .map(note => enharmonicEquivalent(note, bottomPitchClass))
    // render one voicing for each start note
    const notes = starts.map(start => relativeIntervals.map(interval => Note.transpose(start, interval)));
    return voiced.concat(notes);
  }, [])
}

export const topNoteSort = (events) => {
  const lastNote = events[events.length - 1].value; // last voiced note (top note)
  // calculates the distance between the last note and the given voicings top note
  const diff = (voicing) => Math.abs(Note.midi(lastNote) - Note.midi(voicing[voicing.length - 1]));
  // sort voicings by lowest top note difference
  return (a, b) => diff(a) - diff(b);
}

export const voicings = (dictionary, range, sorter = topNoteSort) => (events, event) => {
  if (typeof event.value !== 'string') {
    return events
  }
  let voicings = voicingsInRange(event.value, dictionary, range);
  const { tonic, aliases } = Chord.get(event.value);
  const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
  if (!symbol) {
    console.log(`no voicings found for chord "${event.value}"`);
    return events;
  }
  let notes;
  const lastVoiced = events.filter(e => !!e.chord);
  if (!lastVoiced.length) {
    notes = voicings[Math.ceil(voicings.length / 2)];
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    notes = voicings.sort(sorter(lastVoiced))[0];
  }
  return events.concat(notes.map((note) => ({ ...event, value: note, chord: event.value })));
}
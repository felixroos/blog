import React, { useEffect, useState } from 'react';
import Player from './components/Player';
/* import { piano } from '../../instruments/piano'; */
import composePhrase from './composePhrase';
import mapChordScales from '../graphs/mapChordScales';
import composeChords from './composeChords';
import { midi } from './instruments/midi';
import { guideToneVoicings, lefthandVoicings } from './voicings/generateVoicings';
import { rhythmEvents } from './tree/rhythmEvents';

const crazy = {
  bass: [
    [1, 1, [1, 1]],
    [1, 1, 1],
  ],
  voicings: [
    [1, 1, 1],
    [1, 1, 0, 1, 1, 1],
  ],
};

export default function RhythmicalComposer({ chords }) {
  const [events, setEvents] = useState<any>();
  useEffect(() => {
    const bars = chords.length;
    const duration = bars * 2;
    const withDuration = (tree) => ({ duration, sequential: tree });
    const melodyPattern = [1, 2, 3, 5, 7, 5, 3, 2];
    const melodyOctave = 4;
    const melodyRhythm = withDuration(Array(bars).fill([1, 1, 1, 1, 1, 1, 1, 1]));

    const bassPattern = [1, 3, 5, 3];
    const bassOctave = 2;
    const bassRhythm = withDuration(Array(bars).fill([1, 1, 1, 1]));

    const chordRhythm = withDuration(chords);
    const chordGroove = false;
    let voicingEvents;
    if (chordGroove) {
      const voicingRhythm = withDuration(
        Array(bars).fill([
          [1, 1, 1],
          [1, 1, 0, 1, 1, 1],
        ])
      );
      voicingEvents = composeChords(chordRhythm, voicingRhythm);
    } else {
      // const voicingEvents = rhythmEvents(lefthandVoicings(chordRhythm));
      voicingEvents = rhythmEvents(guideToneVoicings(chordRhythm));
    }
    const scales = withDuration(mapChordScales(chords));
    const melodyEvents = composePhrase(melodyPattern, scales, melodyRhythm, melodyOctave);
    const bassEvents = composePhrase(bassPattern, scales, bassRhythm, bassOctave);
    setEvents([...bassEvents, ...voicingEvents /* , ...melodyEvents */]);
  }, [chords]);
  return (
    <>
      {events && <Player hidePianoRoll={true} instruments={{ piano: midi('IAC-Treiber Bus 1', 1) }} events={events} />}
    </>
  );
}

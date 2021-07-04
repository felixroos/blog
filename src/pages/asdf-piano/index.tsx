import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './styles.css';
import { Piano } from '@tonejs/piano';
import VoicingDisplay from './VoicingDisplay';
// import useHotKeys from './useHotKeys';
import useHotKeys from './useHotKeys';
import getBassNote from './getBassNote';
import tunes from './tunes';
// https://github.com/tonaljs/tonal/blob/master/packages/voicing/index.ts
// https://github.com/tonaljs/tonal/blob/master/packages/voice-leading/index.ts
import { Voicing, VoiceLeading, VoicingDictionary } from '../../../content/components/rhythmical/voicings/Voicing';
import { Note } from '@tonaljs/tonal';
import canUseDOM from '../../../content/components/canUseDOM';
import useWebMidi from '../../../content/components/midi/useWebMidi';

const randomTune = tunes[Object.keys(tunes)[Math.floor(Math.random() * Object.keys(tunes).length)]];

const piano = canUseDOM()
  ? new Piano({
      velocities: 1,
    })
  : null;
piano?.toDestination();

const { lefthand, triads, all } = VoicingDictionary;

const dictionaries = {
  all: {
    ...all,
    '^7#11': ['3M 4A 7M 9M', '7M 9M 10M 11A'],
    '7#11': ['7m 9M 10M 11A', '3M 4A 7m 9M'],
    '7sus4': ['4P 5P 7m 9m', '7m 9m 11P 12P'],
  },
  lefthand,
  triads,
  guidetones: {
    m7: ['3m 7m', '7m 10m'],
    '7': ['3M 7m', '7m 10M'],
    '^7': ['3M 7M', '7M 10M'],
    '69': ['3M 6M', '6M 3M'],
    m7b5: ['3m 7m', '7m 10m'],
    '7b9': ['3M 7m', '7m 10M'],
    '7b13': ['3M 7m', '7m 10M'],
    o7: ['3m 6M', '6M 10m'],
    '7#11': ['3M 7m', '7m 10M'],
    '7#9': ['3M 7m', '7m 3M'],
    mM7: ['3m 7M', '7M 10m'],
    m6: ['3m 6M', '6M 10m'],
  },
  custom: {
    M: ['1P 3M 5P 8P', '5P 8P 10M 12P', '3M 5P 8P 10M'],
    m: ['1P 3m 5P 8P', '5P 8P 10m 12m', '3m 5P 8P 10m'],
    sus4: ['1P 4P 5P 8P', '5P 8P 11P 12P'],
  },
};

export default function AsdfPiano() {
  const [pianoReady, setPianoReady] = useState(false);
  const [midiReady, setMidiReady] = useState(false);
  const [midiOutput, setMidiOutput] = useState<any>();
  const [midiOutputs, setMidiOutputs] = useState<any[]>([]);
  const [midiEnabled, setMidiEnabled] = useState(false);
  const hold = useRef<any>([]);
  const [pedal, setPedal] = useState(false);
  const ready = pianoReady && midiReady;
  useEffect(() => {
    piano?.load().then(() => setPianoReady(true));
  }, []);
  const [chords, setChords] = useState<string>(randomTune);
  const [dictionary, setDictionary] = useState('all');
  const [mute, setMute] = useState(false); // when input focused => mute hotkeys
  const [compact, setCompact] = useState(false);
  const range = ['F3', 'D6'];

  const [choice, setChoice] = useState(0);
  // up down logic (former usePianoPlayer)
  const [selectedIndex, setSelectedIndex] = useState<any>(0);
  useEffect(() => {
    setSelectedIndex(0);
    setChoice(0);
  }, [chords]);

  // generate all possible voicing options
  const last = (a) => a[a.length - 1];
  const byTopNote = (a, b) => (Note.midi(last(a)) || 0) - (Note.midi(last(b)) || 0);

  useWebMidi({
    ready: useCallback(({ outputs }) => {
      if (outputs.length) {
        setMidiOutput(outputs[0]);
        setMidiOutputs(outputs);
      }
      setMidiReady(true);
    }, []),
    connected: useCallback(({ outputs }) => setMidiOutputs(outputs), []),
    disconnected: useCallback(({ outputs }) => setMidiOutputs(outputs), []),
  });

  const chordsArray = chords?.split(' ').filter((c) => !!c) || [];
  const voicings = chordsArray.map((chord) =>
    Voicing.search(chord?.split('/')[0], range, dictionaries[dictionary]).sort(byTopNote)
  );
  const current = voicings[selectedIndex]?.[choice !== -1 ? choice : 0];
  const leader = ({ picks, last }, options) => {
    last = VoiceLeading.topNoteDiff(options, last);
    picks.push(last);
    return { picks, last };
  };
  const next = voicings.slice(selectedIndex + 1).reduce(leader, { picks: [], last: current }).picks;
  let prev;
  prev = voicings.slice(0, selectedIndex).reverse().reduce(leader, { picks: [], last: current }).picks.reverse();
  const options = [...prev, current, ...next];
  const sequence = options.map((voicing, index) => [getBassNote(chordsArray[index]), ...(voicing || [])]);

  // asdf hotkeys
  const hotKeys = [' ', 'a', 's', 'd', 'f', 'g', 'h'];
  useHotKeys(
    {
      keys: hotKeys,
      state: sequence[selectedIndex],
      mute,
      down: ([key, voicing], noteIndex, hold) => {
        const note = voicing[noteIndex];
        if (note) {
          if (midiOutput && midiEnabled) {
            midiOutput?.playNote(note, 1);
          } else {
            piano?.keyDown({ note, velocity: 0.3 + Math.random() / 2 });
          }
        }
        // setActiveKeys(hold);
      },
      up: ([key, voicing], noteIndex) => {
        const note = voicing[noteIndex];
        if (note) {
          if (midiOutput && midiEnabled) {
            if (!pedal) {
              midiOutput?.stopNote(note, 1);
              hold.current = hold.current?.filter((n) => n !== note);
            } else if (!hold.current.includes(note)) {
              hold.current = hold.current?.concat([note]);
            }
          } else {
            piano?.keyUp({ note });
          }
        }
        // setActiveKeys(hold);
      },
    },
    [selectedIndex, sequence, pedal]
  );
  // pedal hotkeys
  useHotKeys(
    {
      keys: ['-'],
      mute,
      down: ([key]) => {
        piano?.pedalDown();
        setPedal(true);
      },
      up: ([key]) => {
        piano?.pedalUp();
        setPedal(false);
        if (midiOutput && midiEnabled) {
          hold.current.forEach((note) => {
            midiOutput?.stopNote(note, 1);
          });
          hold.current = [];
        }
      },
    },
    [midiOutput, midiEnabled]
  );
  // arrow up / down
  useHotKeys(
    {
      keys: ['ArrowDown', 'ArrowUp'],
      mute,
      down: ([key]) => {
        const jumpTo = (i) => (window.location.href = `#voicing-${i > 0 ? i - 1 : i}`);
        let index, pick;
        if (key === 'ArrowDown' || key === 'e') {
          index = (selectedIndex + 1) % chordsArray.length;
          setSelectedIndex(index);
          jumpTo(index);
          // special case: from bottom to top
          pick = index === 0 ? VoiceLeading.topNoteDiff(voicings[0], options[options.length - 1]) : options[index];
        } else if (key === 'ArrowUp' || key === 'q') {
          index = (selectedIndex + chordsArray.length - 1) % chordsArray.length;
          setSelectedIndex(index);
          jumpTo(index);
          // special case: from top to bottom
          pick =
            index === options.length - 1
              ? VoiceLeading.topNoteDiff(voicings[voicings.length - 1], options[0])
              : options[index];
        }

        const optionIndex = voicings[index].sort(byTopNote).indexOf(pick);
        if (optionIndex === -1) {
          console.log(index, pick, 'not found in', voicings[index].sort(byTopNote));
        }
        setChoice(optionIndex || 0);
      },
    },
    [selectedIndex, options, voicings]
  );
  // arrow left / right  logic
  useHotKeys(
    {
      keys: ['ArrowLeft', 'ArrowRight'],
      mute,
      down: ([key]) => {
        let index = choice;
        const opts = voicings[selectedIndex].length;
        if (index === undefined) {
          index = voicings[selectedIndex].sort(byTopNote).indexOf(options[selectedIndex]);
        }
        if (key === 'ArrowLeft' && index > 0) {
          index = index - 1;
          setChoice(index);
        } else if (key === 'ArrowRight' && index < opts - 1) {
          index = index + 1;
          setChoice(index);
        }
      },
    },
    [choice, selectedIndex, voicings, options]
  );
  return (
    <div className="AsdfPiano">
      {!ready && (
        <p>
          <span role="img" aria-label="piano">
            🎹
          </span>{' '}
          This may take a few seconds to load..
          <br />
          If nothing happens, this app might not work with your browser. Try again with Chrome
        </p>
      )}
      {ready && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <h1 style={{ margin: 0 }}>
              <span style={{ color: 'tomato' }}>asdf</span>-<span style={{ color: 'steelblue' }}>piano</span>
            </h1>
            <p style={{ margin: '10px' }}>Play piano like Bill Evans, using only your computer keyboard.</p>
          </div>
          <input
            style={{ width: '470px', margin: '10px' }}
            value={chords}
            onChange={(e) => {
              setChords(e.target.value);
            }}
            onFocus={() => setMute(true)}
            onBlur={() => setMute(false)}
          />
          <select style={{ width: '100px' }} value={dictionary} onChange={(e) => setDictionary(e.target.value)}>
            {Object.keys(dictionaries).map((dict, index) => (
              <option key={index} value={dict}>
                {dict}
              </option>
            ))}
          </select>
          <br />
          {!!midiOutputs?.length && (
            <label>
              <input type="checkbox" checked={midiEnabled} onChange={(e) => setMidiEnabled(e.target.checked)} /> use
              MIDI output{' '}
              <select onChange={(e) => setMidiOutput(midiOutputs[e.target.value])}>
                {midiOutputs?.map((output, i) => (
                  <option key={output.name} value={i}>
                    {output.name}
                  </option>
                ))}
              </select>{' '}
              instead of in-browser piano
            </label>
          )}
          <div
            style={{
              height: '448px',
              overflow: 'auto',
              backgroundColor: '#3B3B3F',
            }}
          >
            {sequence.map((voicing, i) => (
              <div key={i} id={`voicing-${i}`}>
                <VoicingDisplay
                  voicing={voicing}
                  range={range}
                  chord={chordsArray[i]}
                  piano={piano}
                  color={selectedIndex === i ? 'tomato' : 'steelblue'}
                  choice={selectedIndex === i ? choice : ''}
                  compact={compact}
                  activeKeys={
                    selectedIndex === i ? voicing : []
                    /*activeKeys
                  .filter(([_, j]) => j === i)
                .map(([k]) => voicing[hotKeys.indexOf(k)])*/
                  }
                  labels={hotKeys}
                  onTrigger={() => setSelectedIndex(i)}
                />
              </div>
            ))}
          </div>
          <p style={{ margin: '4px' }}>
            <b>space</b> bass, <b>asdf</b> voicing notes, ⬇ next, ⬆ previous ⬅ lower ➡ higher, <b>-</b>: pedal
          </p>
          <p>
            Screencasted "Performances": <a href="https://streamable.com/eqg9si">Beatrice</a>,{' '}
            <a href="https://streamable.com/ubpaie">giant steps</a>,{' '}
            <a href="https://streamable.com/eahtc2">comptine d'autre ete</a>
          </p>
          <p>
            Made with{' '}
            <a href="https://github.com/tonaljs/tonal/tree/master/packages/voicing#tonaljsvoicing">@tonaljs/voicing</a>,{' '}
            <a href="https://www.npmjs.com/package/@tonejs/piano">@tonejs/piano</a>,{' '}
            <a href="https://www.npmjs.com/package/svg-piano">svg-piano</a>, <a href="https://reactjs.org/">react</a>{' '}
            and much ❤️️
          </p>
          <p>
            ☕ <a href="http://buymeacoffee.com/felixroos">Buy me a coffee</a>
          </p>
          <p>
            Only tested on Chrome + MacOS, &copy; <a href="https://github.com/felixroos">felixroos</a>
          </p>
        </>
      )}
    </div>
  );
}

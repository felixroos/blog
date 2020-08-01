import React, { useState } from 'react';
import { State } from 'react-powerplug';
import * as Tone from 'tone';
import { Chord, Note, Interval } from '@tonaljs/tonal';
import { Harmony } from '../../../content/drafts/voicing/Harmony';
import { Voicing } from '../../../content/drafts/voicing/Voicing';
import Keyboard from '../../../content/components/Keyboard';
const { PolySynth, Synth } = Tone;
const isBrowser = typeof window !== 'undefined';
const poly = isBrowser && new PolySynth(6, Synth, { volume: -12 }).toMaster();
import DynamicTable from '../../../content/components/common/DynamicTable';
import { min, max } from 'd3-array';
import Layout from '../Layout';

export default function Voicings() {
  const [state, setState] = useState<any>({
    wave: 'fmsine',
    sortBy: 'topMidi',
    tonic: 'D',
    symbol: '-9',
    bottomPitches: '',
    maxNotes: 5,
    minNotes: 5,
    defaultDistances: '1-7',
    bottomDistances: '5-15 2-8',
    topDistances: '3-7',
    arpeggioInterval: 200,
    bottomDegrees: '1 3,5,7',
    topDegrees: ''
  });
  const parseInts = (divider) => (d) =>
    d.split(divider).map((_d) => parseInt(_d));
  const options = {
    ...state,
    range: ['A1', 'C5'],
    notes: [state.minNotes, state.maxNotes] || 5,
    bottomPitches: state.bottomPitches ? state.bottomPitches.split(' ') : [],
    topPitches: state.topPitches ? state.topPitches.split(' ') : [],
    bottomDegrees: state.bottomDegrees
      ? state.bottomDegrees.trim().split(' ').map(parseInts(','))
      : [],
    topDegrees: state.topDegrees
      ? state.topDegrees.trim().split(' ').map(parseInts(','))
      : [],
    bottomDistances: state.bottomDistances
      ? state.bottomDistances.trim().split(' ').map(parseInts('-'))
      : [],
    topDistances: state.topDistances
      ? state.topDistances.trim().split(' ').map(parseInts('-'))
      : [],
    defaultDistances: state.defaultDistances
      ? state.defaultDistances.trim().split('-').map(parseInts('-'))
      : []
  };
  let voicings = Voicing.getCombinations(state.tonic + state.symbol, options);
  const flatMidi = [].concat.apply([], voicings).map((n) => Note.midi(n));
  const range = [min(flatMidi), max(flatMidi)].map((midi) =>
    Note.fromMidi(+midi)
  );
  //.map((note) => Note.simplify(note));
  return (
    <Layout
      sidebar={
        <>
          <label>
            <select
              value={state.tonic}
              onChange={(e) => setState({ ...state, tonic: e.target.value })}
            >
              <option>C</option>
              <option>C#</option>
              <option>Db</option>
              <option>D</option>
              <option>D#</option>
              <option>Eb</option>
              <option>E</option>
              <option>F</option>
              <option>F#</option>
              <option>Gb</option>
              <option>G</option>
              <option>G#</option>
              <option>Ab</option>
              <option>A</option>
              <option>A#</option>
              <option>Bb</option>
              <option>B</option>
            </select>
            <select
              value={state.symbol}
              onChange={(e) => setState({ ...state, symbol: e.target.value })}
            >
              <option>^</option>
              <option>sus4</option>
              <option>sus2</option>
              <option>2</option>
              <option>^#5</option>
              <option>6</option>
              <option>^7</option>
              <option>^7#5</option>
              <option>^7#11</option>
              <option>^9</option>
              <option>^9#11</option>
              <option>^13</option>
              <option>7</option>
              <option>7sus4</option>
              <option>7sus</option>
              <option>7b5</option>
              <option>7#5</option>
              <option>7+</option>
              <option>7#9</option>
              <option>7b9</option>
              <option>7#11</option>
              <option>7b13</option>
              <option>7b9b5</option>
              <option>7b9sus</option>
              <option>7b9#5</option>
              <option>7#9b5</option>
              <option>7b9#9</option>
              <option>7#9#5</option>
              <option>7b9b13</option>
              <option>7b9#11</option>
              <option>7#9#11</option>
              <option>9</option>
              <option>9sus</option>
              <option>9#5</option>
              <option>9b5</option>
              <option>9#11</option>
              <option>13</option>
              <option>13sus</option>
              <option>13#9</option>
              <option>13b9</option>
              <option>13#11</option>
              <option>11</option>
              <option>-</option>
              <option>-6</option>
              <option>-#5</option>
              <option>-b6</option>
              <option>-7</option>
              <option>-^7</option>
              <option>-9</option>
              <option>-^9</option>
              <option>-11</option>
              <option>h</option>
              <option>h7</option>
              <option>-7b5</option>
              <option>o</option>
              <option>o7</option>
            </select>{' '}
          </label>
          <br />
          <label title="minimum number of notes">
            <input
              type="number"
              min="1"
              max="8"
              value={state.minNotes}
              onChange={(e) => setState({ ...state, minNotes: e.target.value })}
            />{' '}
            -
            <input
              type="number"
              min="1"
              max="8"
              value={state.maxNotes}
              onChange={(e) => setState({ ...state, maxNotes: e.target.value })}
            />
            notes
          </label>
          <br />
          <label title="min-max distances between the notes in semitones from the bottom up. all remaining will default to minDistance-maxDistance">
            <input
              type="text"
              value={state.bottomDistances}
              onChange={(e) =>
                setState({ ...state, bottomDistances: e.target.value })
              }
            />
            bottomDistances (min0-max0 min1-max1 ...){' '}
          </label>
          <br />
          <label title="default min-max distance between notes. in semitones. can be overridden by bottomDistances / topDistances">
            <input
              type="text"
              value={state.defaultDistances}
              onChange={(e) =>
                setState({ ...state, defaultDistances: e.target.value })
              }
            />{' '}
            defaultDistances (min-max semitones)
          </label>
          <br />
          <label title="min-max distances between the notes in semitones to the top. all remaining will default to minDistance-maxDistance">
            <input
              type="text"
              value={state.topDistances}
              onChange={(e) =>
                setState({ ...state, topDistances: e.target.value })
              }
            />{' '}
            topDistance(s) (... minTop-maxTop){' '}
          </label>
          <br />
          <label title="all degree options for the bottom note. number(s, space seperated)">
            <input
              type="text"
              value={state.bottomDegrees}
              onChange={(e) =>
                setState({ ...state, bottomDegrees: e.target.value })
              }
            />{' '}
            bottomDegree(s) (1-7)
          </label>
          <br />
          <label title="all degree options for the top note. number(s, space seperated)">
            <input
              type="text"
              value={state.topDegrees}
              onChange={(e) =>
                setState({ ...state, topDegrees: e.target.value })
              }
            />{' '}
            topDegree(s) (1-7)
          </label>
          <br />
          <label title="time between each note in ms. choose 0 to play all at once.">
            <input
              type="number"
              value={state.arpeggioInterval}
              onChange={(e) =>
                setState({ ...state, arpeggioInterval: e.target.value })
              }
              min="0"
              max="1000"
            />
            arpeggio (ms){' '}
          </label>
          <br />
          <label>
            <select
              value={state.sortBy}
              onChange={(e) => setState({ ...state, sortBy: e.target.value })}
            >
              <option value="topMidi">top note</option>
              <option value="bottomMidi">bottom note</option>
              <option value="midiMedian">median note</option>
              <option value="topDegree">top degree</option>
              <option value="bottomDegree">bottom degree</option>
              <option value="semitoneSpread">spread</option>
              <option value="avgSpread">average spread</option>
              <option value="leapSemitones">leap</option>
              <option value="maxDistance">maxDistance</option>
              <option value="minDistance">minDistance</option>
            </select>
            sort by{' '}
          </label>
          <br />
          <label>
            <select
              value={state.wave}
              onChange={(e) => setState({ ...state, wave: e.target.value })}
            >
              <option value="sine">sine</option>
              <option value="triangle">triangle</option>
              <option value="sawtooth">sawtooth</option>
              <option value="square">square</option>
              <option value="pwm">pwm</option>
              <option value="pulse">pulse</option>
              <option value="fmsine">fmsine</option>
              <option value="fmtriangle">fmtriangle</option>
              <option value="fmsawtooth">fmsawtooth</option>
              <option value="fmsquare">fmsquare</option>
              <option value="amsine">amsine</option>
              <option value="amtriangle">amtriangle</option>
              <option value="amsawtooth">amsawtooth</option>
              <option value="amsquare">amsquare</option>
              <option value="fatsine">fatsine</option>
              <option value="fattriangle">fattriangle</option>
              <option value="fatsawtooth">fatsawtooth</option>
              <option value="fatsquare">fatsquare</option>
            </select>{' '}
            oscillator wave
          </label>
          <br />
          <strong>TBD:</strong>
          <br />
          <ul>
            <li>Beautify Interface</li>
            <li>Steps are buggy - test</li>
            <li>
              Reimplement rules, use array of objects with voices as selector
            </li>
          </ul>
          <a href="../">Go back to blog</a>
        </>
      }
      main={
        <>
          <DynamicTable
            heading={<>{voicings.length} voicings found</>}
            cols={[
              {
                property: 'keys',
                resolve: (notes) => notes,
                display: (keys) => (
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      // e.stopImmediatePropagation();
                      e.preventDefault();
                      poly.triggerAttack(keys);
                    }}
                    onMouseUp={(e) => poly.releaseAll()}
                    onMouseLeave={(e) => poly.releaseAll()}
                  >
                    <Keyboard
                      mouseControl={false}
                      keyControl={false}
                      options={{
                        scaleX: 0.5,
                        scaleY: 0.5,
                        range,
                        colorize: [
                          {
                            keys,
                            color: 'steelblue'
                          }
                        ]
                      }}
                    />
                  </div>
                )
              },
              {
                property: 'structure',
                resolve: (keys: string[]) => {
                  const { steps, intervals } = Voicing.analyze(
                    keys,
                    state.tonic
                  );
                  return (
                    <>
                      {keys.join(' ')}
                      <br />
                      {steps.join(' ')}
                      <br />
                      {intervals.join(' ')}
                    </>
                  );
                }
              },
              {
                property: 'spread',
                resolve: (keys) => Voicing.analyze(keys, state.tonic).spread,
                sort: (a, b) => Interval.semitones(a) - Interval.semitones(b)
              },
              {
                property: 'leap',
                resolve: (keys) => Voicing.analyze(keys, state.tonic).leap,
                sort: (a, b) => Interval.semitones(a) - Interval.semitones(b)
              },
              {
                property: 'midi median',
                resolve: (keys) =>
                  Voicing.analyze(keys, state.tonic).midiMedian,
                sort: (a, b) => a - b
              }
            ]}
            rows={voicings}
          />
        </>
      }
    />
  );
}

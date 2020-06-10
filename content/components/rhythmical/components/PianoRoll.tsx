import React from 'react';
import { Note, Range } from '@tonaljs/tonal';
import { scaleLinear } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { min, max } from 'd3-array';
console.log(Note.midi('sn'));

export default function PianoRoll(props: PianoRollProps) {
  let {
    width = 600,
    height = 200,
    noteRange,
    rhythmLanes,
    noteLanes,
    timeRange,
    strokeWidth = 1,
    hiddenSymbols = ['r'],
    fold = false,
    time = 0,
    center = 0.5,
    events
  } = props;
  const deepest = max(events.map((e) => (e.path ? e.path.length : 1)));
  center = center * width;
  // get all unique event values
  const uniqueLanes = events
    .filter(({ value }) => hiddenSymbols.indexOf(value) === -1)
    .map((e) => e.value)
    .filter((v, i, e) => e.indexOf(v) === i)
    .sort((a, b) => Note.midi(b) - Note.midi(a));
  const uniqueNoteLanes = uniqueLanes
    .filter((n) => !!Note.name(n))
    .map((note) => note.toUpperCase());
  const uniqueRhythmLanes = uniqueLanes.filter((n) => !Note.name(n));

  const maxTime = max(events.map((e) => e.time + e.duration));

  timeRange = timeRange ? [timeRange[0], timeRange[1]] : [0, maxTime];
  // create lanes for all possible event values
  let lanes;
  if (fold) {
    // lanes = uniqueLanes;
    lanes = (noteLanes
      ? noteLanes.filter(
          (note) =>
            uniqueNoteLanes.find((used) => Note.midi(used) === Note.midi(note))
          // must match by midi to also detect enharmonic equivalents
        )
      : uniqueNoteLanes
    ).concat(
      rhythmLanes
        ? rhythmLanes.filter((key) => uniqueRhythmLanes.indexOf(key) !== -1)
        : uniqueRhythmLanes.reverse()
    );
  } else {
    const midiRange = noteRange
      ? noteRange.map((n) => Note.midi(n))
      : [
          min(uniqueNoteLanes.map((n) => Note.midi(n))),
          max(uniqueNoteLanes.map((n) => Note.midi(n)))
        ];
    noteLanes = (noteLanes
      ? noteLanes
      : Range.chromatic(midiRange.reverse().map((m) => Note.fromMidi(m)))
    ).map((note) => note.toUpperCase());
    lanes = noteLanes.concat(rhythmLanes || uniqueRhythmLanes.reverse());
  }

  const x = scaleLinear()
      .domain(timeRange)
      .range([strokeWidth, width - strokeWidth]),
    length = scaleLinear().domain([0, maxTime]).range([0, width]),
    y = scaleLinear()
      .domain([lanes.length, 0])
      .range([height - strokeWidth, strokeWidth]);

  const barThickness = round(y(1) - strokeWidth);

  // render only events that are in sight + not a hiddenSymbol
  const renderedEvents = events.filter(
    ({ value, time, duration }) =>
      hiddenSymbols.indexOf(value) === -1 &&
      (lanes.indexOf(value) !== -1 || lanes.indexOf(value.toUpperCase()) !== -1)
  );
  const timeOffset = length(time) % width;

  const ppl = height / lanes.length;

  function renderLanes(offset = 0) {
    return (
      <g>
        {renderedEvents.map(
          ({ value, time: eventTime, duration, path, color }, i) => {
            const left = round(x(eventTime + offset) - center);
            const w = round(length(duration));
            const isVisible =
              left < width - strokeWidth + timeOffset &&
              left + w > strokeWidth + timeOffset;
            if (!isVisible) {
              return;
            }
            value = Note.midi(value)
              ? Note.simplify(value).toUpperCase() // fixes case problems
              : value;
            const index = lanes.indexOf(value);
            const isActive =
              timeOffset !== 0 &&
              timeOffset + center > left &&
              timeOffset + center < left + w;
            //style={{transition: 'fill .1s out'}}
            return (
              <rect
                rx={ppl / 2}
                ry={ppl / 2}
                stroke="black"
                strokeWidth={strokeWidth}
                fill={
                  isActive
                    ? 'white'
                    : color ||
                      interpolateBlues((path ? path.length : 1) / deepest)
                }
                key={i}
                x={left}
                y={round(y(index))}
                width={w}
                height={barThickness}
              />
            );
          }
        )}
      </g>
    );
  }
  return (
    <svg {...{ width, height }}>
      <g
        style={{
          transform: `translateX(${-round(timeOffset)}px)`,
          willChange: 'transform'
        }}
      >
        {renderLanes()}
        {renderLanes(maxTime)}
        {renderLanes(2 * maxTime)}
      </g>
      <line
        x1={center - round(strokeWidth)}
        x2={center - round(strokeWidth)}
        y1={0}
        y2={height}
        strokeWidth={strokeWidth * 2}
        stroke={'black'}
      />
    </svg>
  );
}

export interface PianoRollProps {
  width?: number;
  height?: number;
  hiddenSymbols?: string[];
  fold?: boolean;
  time?: number;
  rhythmLanes?: string[]; // extra non note lanes
  noteLanes?: string[]; // custom note lanes
  center?: number; // where is now?
  events: {
    value: string;
    time: number;
    duration: number;
    path?: [number, number, number][];
    color?: string;
  }[];
  noteRange?: [string, string];
  timeRange?: [number, number];
  strokeWidth?: number;
}

function round(n: number) {
  return Math.floor(n * 2) / 2;
}

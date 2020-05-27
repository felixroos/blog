import React from 'react';
import { Note } from '@tonaljs/tonal';
import { scaleLinear } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { max } from 'd3-array';
import { NestedArray, flatRhythm } from './rhythmical';

export default function PianoRoll(props: PianoRollProps) {
  let {
    width = 600,
    height = 200,
    margin = 1,
    noteRange = ['C3', 'C4'],
    timeRange = [0, 1],
    strokeWidth = 1,
    events
  } = props;
  const deepest = max(events.map((e) => (e.path ? e.path.length : 1)));
  const midiRange = [Note.midi(noteRange[0]), Note.midi(noteRange[1])];
  const x = scaleLinear()
      .domain(timeRange)
      .range([margin, width - margin]),
    y = scaleLinear()
      .domain([midiRange[0] - 1, midiRange[1]])
      .range([height - margin, margin]);

  return (
    <svg {...{ width, height }}>
      {events.map(({ value, time, duration, path }, i) => {
        return (
          <rect
            stroke="black"
            strokeWidth={strokeWidth}
            fill={interpolateBlues((path ? path.length : 1) / deepest)}
            key={i}
            x={x(time)}
            y={y(Note.midi(value))}
            width={x(duration) - strokeWidth}
            height={y(midiRange[1] - 1) - strokeWidth}
          />
        );
      })}
    </svg>
  );
}

export function rhythmicalRoll(rhythm: NestedArray<string>) {
  return flatRhythm(rhythm, 1, true).filter(({ value }) => value !== 'r');
}

export interface PianoRollProps {
  width?: number;
  height?: number;
  margin?: number;
  events: {
    value: string;
    time: number;
    duration: number;
    path?: [number, number, number][];
  }[];
  noteRange?: [string, string];
  timeRange?: [number, number];
  strokeWidth?: number;
}

import React from 'react';
import Spiral, { SpiralProps, Line } from '../common/Spiral';
import { angle, frequencyColor } from '../tuning/tuning';

export default function HarmonicSpiral(props: SpiralProps) {
  const { min, max, onTrigger, hideLabels, hideLines } = props;
  function getLines(): Line[] {
    if (hideLines) {
      return [];
    }
    return Array.from(
      { length: Math.pow(2, max - 1) - Math.pow(2, min) + 1 },
      (_, i) => i + Math.pow(2, min)
    ).map((n) => [angle(n), angle(n) + 1, frequencyColor(n * 440)]);
  }
  function getLabels() {
    if (hideLabels) {
      return [];
    }
    return Array.from(
      { length: Math.pow(2, max) - Math.pow(2, min) + 1 },
      (_, i) => i + Math.pow(2, min)
    ).map((n) => ({
      label: n + '',
      angle: angle(n),
      fill: frequencyColor(n * 440),
      color: 'black'
    }));
  }
  return (
    <Spiral
      {...props}
      lines={getLines()}
      labels={getLabels()}
      onTrigger={(i) => onTrigger && onTrigger(i + Math.pow(2, min))}
    />
  );
}

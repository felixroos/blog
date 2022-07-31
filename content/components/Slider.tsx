import React from 'react';

export default function Slider({ value, min, max, step }: any) {
  const [state, setState] = value;
  const diff = max - min;
  return (
    <input
      type="range"
      step={step}
      value={((state - min) / diff) * 100}
      onChange={(e) => setState((parseInt(e.target.value) / 100) * diff + min)}
    />
  );
}

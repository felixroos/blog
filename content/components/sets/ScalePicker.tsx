import React, { useEffect, useState } from 'react';
import { Scale } from '@tonaljs/tonal';
import SimpleSelect from '../common/SimpleSelect';
import allPitches from './allPitches';

export default function ScalePicker({ scale: scaleProp, scales: scalesProp, onChange }) {
  const { tonic: initialTonic, type: initialType } = Scale.get(scaleProp);
  const [tonic, setTonic] = useState(initialTonic);
  const [type, setType] = useState(initialType);
  const scales = scalesProp || ['major', 'minor', 'dorian', 'mixolydian', 'harmonic minor', 'melodic minor'];
  useEffect(() => {
    onChange(`${tonic} ${type}`);
  }, [tonic, type]);
  useEffect(() => {
    if (scaleProp) {
      const s = Scale.get(scaleProp);
      setTonic(s.tonic);
      setType(s.type);
    }
  }, [scaleProp]);
  return (
    <>
      <SimpleSelect label="tonic" value={tonic} onChange={(v) => setTonic(v)} values={allPitches} />
      <SimpleSelect label="scale" value={type} onChange={(v) => setType(v)} values={scales} />
    </>
  );
}

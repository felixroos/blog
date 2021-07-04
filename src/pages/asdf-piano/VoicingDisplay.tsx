import React, { useCallback, useEffect, useMemo } from 'react';
import './styles.css';
import Keyboard from './Keyboard';
import playNotes from './playNotes';
import { Note } from '@tonaljs/tonal';
import Claviature from '../../../content/components/common/Claviature';

export default function VoicingDisplay({
  color,
  voicing,
  chord,
  range,
  piano,
  onTrigger,
  activeKeys,
  labels,
  choice,
  compact,
}: any) {
  const colorizeKeys = (keys, keyColor) => ({
    keys: keys || [],
    color: keyColor,
  });
  const scale = compact ? 1 : 1;
  const lowerHeight = compact ? 16 : 45;
  const upperHeight = compact ? 16 : 100;
  useEffect(() => {
    // console.log('voicing changed', voicing);
  }, [voicing]);
  const keyboard = useMemo(
    () => (
      <Claviature
        onClick={(key) => playNotes(piano, [key.notes[0]])}
        options={{
          range,
          labels: (activeKeys || []).reduce((all, key, k) => Object.assign(all, { [key]: labels[k] }), {}),
          scaleY: scale,
          scaleX: scale,
          topLabels: compact,
          upperHeight,
          lowerHeight,
          colorize: [
            colorizeKeys(
              voicing?.map((n) => Note.simplify(n)),
              color
            ),
          ],
        }}
      />
    ),
    [voicing]
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {keyboard}
      <button
        style={{ height: (upperHeight + lowerHeight) * scale, width: '100px' }}
        onMouseDown={() => {
          playNotes(piano, voicing, chord);
          onTrigger?.();
        }}
      >
        {chord}
        <br />
        {choice}
      </button>
    </div>
  );
}

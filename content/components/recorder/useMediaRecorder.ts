import { useState, useRef } from 'react';
import canUseDOM from '../canUseDOM';

import { useUserMedia } from './useUserMedia';

const MediaRecorder = canUseDOM() ? window?.['MediaRecorder'] as any : undefined; // for ts

export function useMediaRecorder({ onStart, onStop, onData }: { onStart?: any, onStop?: any, onData?: any }) {
  const [recorder, setRecorder] = useState<any>();
  const { getStream } = useUserMedia({ audio: true, video: false });
  const audioChunks = useRef([]);
  async function start(timeslices) {
    const stream = await getStream();
    audioChunks.current = [];
    const _recorder = new MediaRecorder(stream);
    setRecorder(_recorder);
    onStart && onStart(_recorder);
    _recorder.start(timeslices);
    _recorder.addEventListener('dataavailable', (event) => {
      audioChunks.current.push(event.data);
      onData && onData(event.data, audioChunks.current);
    });
    _recorder.addEventListener('stop', () => onStop && onStop(audioChunks.current));
  }
  function stop() {
    if (recorder) {
      recorder.stop();
    }
  }
  return { start, stop };
}

import React, { useState } from 'react';
import canUseDOM from '../canUseDOM';
import { Waveform } from '../Waveform';
import { useMediaRecorder } from './useMediaRecorder';

export const Recorder = () => {
  const [pcm, setPcm] = useState<Float32Array | undefined>();
  const { start, stop } = useMediaRecorder({
    onStop: async (audioChunks) => {
      const audioBlob = new Blob(audioChunks);
      setPcm(await getPCM(audioBlob));
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    },
  });
  return (
    <>
      <button onClick={() => start(200)}>record</button>
      <button onClick={() => stop()}>stop</button>
      <br />
      {pcm && <Waveform pcm={pcm} />}
    </>
  );
};

const audioContext = canUseDOM() ? new AudioContext() : null;

function getPCM(blob): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      // Convert array buffer into audio buffer
      audioContext?.decodeAudioData(arrayBuffer, (audioBuffer) => {
        // Do something with audioBuffer
        const pcm = audioBuffer.getChannelData(0);
        resolve(pcm);
      });
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(blob);
  });
}

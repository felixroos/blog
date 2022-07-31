import { useEffect, useRef, useState } from 'react';

export default function WAASandbox() {
  const [audioContext, setAudioContext] = useState<any>();
  const [gain, setGain] = useState<number>(0.5);
  const [freqSlider, setFreqSlider] = useState<number>(0);
  const [cutoff, setCutoff] = useState<number>(1000);
  const gainNode = useRef<any>();
  const oscillatorNode = useRef<any>();
  const filter = useRef<any>();
  useEffect(() => {
    const audioCtx = new window.AudioContext(/*  || window.webkitAudioContext */);
    setAudioContext(audioCtx);
    gainNode.current = audioCtx.createGain();
    gainNode.current.value = gain;
    filter.current = audioCtx.createBiquadFilter();
    filter.current.type = 'lowpass';
    filter.current.frequency.setValueAtTime(cutoff, audioCtx.currentTime);
    filter.current.gain.setValueAtTime(25, audioCtx.currentTime);
  }, []);
  function getFreq(sliderValue) {
    return Math.pow(2, +sliderValue / 12) * 55;
  }
  function getOscillator() {
    oscillatorNode.current?.stop();
    oscillatorNode.current = audioContext.createOscillator();
    const oscillator = oscillatorNode.current;
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(getFreq(freqSlider), audioContext.currentTime); // value in hertz
    oscillator //
      .connect(gainNode.current) //
      .connect(filter.current) //
      .connect(audioContext.destination); //
    return oscillator;
  }
  return (
    <nav>
      <button
        onClick={() => {
          getOscillator().start();
        }}
      >
        start
      </button>
      <button
        onClick={() => {
          oscillatorNode.current?.stop();
        }}
      >
        stop
      </button>
      <input
        min="0"
        max="2"
        value={gain}
        step="0.1"
        type="range"
        onChange={(e) => {
          setGain(+e.target.value);
          // gainNode.current.gain.value = +e.target.value;
          gainNode.current.gain.setValueAtTime(+e.target.value, audioContext.currentTime);
        }}
      ></input>
      <input
        min="0"
        max="48"
        value={freqSlider}
        step="1"
        type="range"
        onChange={(e) => {
          setFreqSlider(+e.target.value);
          const f = getFreq(+e.target.value);
          oscillatorNode.current.frequency.value = f;
        }}
      ></input>
      <input
        min="0"
        max="20000"
        value={cutoff}
        step="10"
        type="range"
        onChange={(e) => {
          setCutoff(+e.target.value);
          filter.current.frequency.value = +e.target.value;
        }}
      ></input>
    </nav>
  );
}

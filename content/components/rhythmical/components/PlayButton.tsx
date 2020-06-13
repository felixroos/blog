import Fab from '@material-ui/core/Fab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { playEvents, synth, drawCallback } from './Player';
import drums from '../../../assets/samples/tidal/tidal';
import * as Tone from 'tone';
import { useState, useRef } from 'react';

export default function PlayButton({ events, instruments, draw, loop }) {
  const [part, setPart] = useState<any>(false);
  const drawLoop = useRef<any>();
  function stop() {
    drawLoop.current && drawLoop.current.stop();
    part.stop();
    Tone.Transport.stop();
    setPart(false);
  }
  function start() {
    setPart(
      playEvents(events, {
        instruments: instruments || { synth, drums },
        loop
      })
    );
    drawLoop.current = drawCallback(draw);
  }
  return (
    <Fab color="primary" onClick={() => (part ? stop() : start())}>
      {!part ? <PlayArrowIcon /> : <StopIcon />}
    </Fab>
  );
}

import Fab from '@material-ui/core/Fab';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { playEvents, synth, drawCallback } from './Player';
import drums from '../../../assets/samples/tidal/tidal';
import * as Tone from 'tone';
import { useState, useRef } from 'react';

export default function PlayButton({ events, instruments, draw }) {
  const [part, setPart] = useState<any>(false);
  const drawLoop = useRef<any>();
  return (
    <Fab
      color="primary"
      onClick={() => {
        if (!part) {
          setPart(
            playEvents(events, {
              instruments: instruments || { synth, drums }
            })
          );
          drawLoop.current = drawCallback(draw);
        } else {
          drawLoop.current && drawLoop.current.stop();
          part.stop();
          Tone.Transport.stop();
          setPart(false);
        }
      }}
    >
      {!part ? <PlayArrowIcon /> : <StopIcon />}
    </Fab>
  );
}

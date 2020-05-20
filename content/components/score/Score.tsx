// copy of https://github.com/markacola/react-vexflow/blob/master/src/index.js
import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';
import { renderScore, ScoreProps } from './score';

const VF = Vex.Flow;
const { Renderer } = VF;

export function Score(props: ScoreProps) {
  props = {
    staves: [],
    clef: 'treble',
    timeSignature: '4/4',
    width: 450,
    height: 150,
    ...props
  };
  const container = useRef();
  const rendererRef = useRef<any>();
  useEffect(() => {
    rendererRef.current =
      rendererRef.current ||
      new Renderer(container.current, Renderer.Backends.SVG);
    renderScore({ renderer: rendererRef.current, ...props });
  }, [props.staves]);

  return <div ref={container} />;
}

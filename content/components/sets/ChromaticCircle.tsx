import React from 'react';
import ConnectedCircle from '../common/ConnectedCircle';
import getNodes from './getNodes';
import { Range } from '@tonaljs/tonal';

export default function ChromaticCircle({ pitches,tonic, ...props }) {
  const notes = Range.chromatic(['C3', 'B3']);
  return (
    <div>
      <ConnectedCircle margin={3} nodes={getNodes(notes, pitches,tonic)} links={[]} r={120} {...props} />
    </div>
  );
}

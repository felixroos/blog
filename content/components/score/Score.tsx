// copy of https://github.com/markacola/react-vexflow/blob/master/src/index.js
import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';
import { Note } from '@tonaljs/tonal';

const VF = Vex.Flow;
const { Formatter, Renderer, Stave, StaveNote } = VF;

const clefWidth = 30;
const timeWidth = 30;

export function Score({
  staves = [],
  clef = 'treble',
  timeSignature = '4/4',
  width = 450,
  height = 150
}) {
  const container = useRef();
  const rendererRef = useRef<any>();

  useEffect(() => {
    //if (rendererRef.current == null) {
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(
        container.current,
        Renderer.Backends.SVG
      );
    }
    const renderer = rendererRef.current;
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');
    const clefAndTimeWidth =
      (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
    const staveWidth = (width - clefAndTimeWidth) / staves.length;

    let currX = 0;
    staves.forEach((notes, i) => {
      const stave = new Stave(currX, 0, staveWidth);
      if (i === 0) {
        stave.setWidth(staveWidth + clefAndTimeWidth);
        clef && stave.addClef(clef);
        timeSignature && stave.addTimeSignature(timeSignature);
      }
      currX += stave.getWidth();
      stave.setContext(context).draw();

      const processedNotes = notes
        .map((note) => (typeof note === 'string' ? { key: note } : note))
        .map((note) =>
          Array.isArray(note) ? { key: note[0], duration: note[1] } : note
        )
        .map(({ key, ...rest }) =>
          typeof key === 'string'
            ? {
                key: key.includes('/')
                  ? key
                  : `${Note.get(key).pc}/${Note.get(key).oct}`,
                ...rest
              }
            : rest
        )
        .map(({ key, keys, duration = 'q' }) => {
          keys = key ? [key] : keys;
          const note = new StaveNote({
            keys,
            duration: String(duration)
          });
          keys.forEach((key, index) => {
            const accidentals = Note.accidentals(key.replace('/', ''));
            if (accidentals) {
              note.addAccidental(index, new VF.Accidental(accidentals));
            }
          });
          return note;
        });

      /* const beams = VF.Beam.generateBeams(processedNotes, {
        groups: [new Vex.Flow.Fraction(1, 4)]
      }); */
      Formatter.FormatAndDraw(context, stave, processedNotes, {
        auto_beam: true,
        align_rests: false
      });
      /* beams.forEach((b) => b.setContext(context).draw()); */
      /* stave.setContext(context).draw(); */
    });
  }, [staves]);

  return <div ref={container} />;
}

import Vex from 'vexflow';
import { Note } from '@tonaljs/tonal';

const VF = Vex.Flow;
const { Formatter, Renderer, Stave, StaveNote } = VF;

export declare interface ScoreProps {
  staves?: any[];
  clef?: 'treble' | 'bass';
  timeSignature?: string;
  width?: number;
  height?: number;
  renderer?: any;
  container?: any;
}

export function renderScore({
  staves = [],
  clef = 'treble',
  timeSignature = '4/4',
  width = 450,
  height = 150,
  renderer,
  container
}: ScoreProps) {
  const clefWidth = 30;
  const timeWidth = 30;
  renderer = renderer || new Renderer(container, Renderer.Backends.SVG)
  renderer.resize(width, height);
  const context = renderer.getContext();
  context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');
  const clefAndTimeWidth =
    (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
  const staveWidth = (width - clefAndTimeWidth) / staves.length - 1;

  let currX = 0;
  let allNotes = [];
  let allProcessedNotes = [];
  staves.forEach((notes, i) => {
    const stave = new Stave(currX, 0, staveWidth);
    if (i === 0) {
      stave.setWidth(staveWidth + clefAndTimeWidth);
      clef && stave.addClef(clef);
      timeSignature && stave.addTimeSignature(timeSignature);
    }
    const getVexFlowKey = (key) => key.includes('/')
      ? key
      : `${Note.get(key).pc}/${Note.get(key).oct}`
    currX += stave.getWidth();
    stave.setContext(context).draw();
    allNotes = allNotes.concat(notes);
    const processedNotes = notes
      .map((note) => (typeof note === 'string' ? { key: note } : note))
      .map((note) =>
        Array.isArray(note) ? { key: note[0], duration: note[1] } : note
      )
      .map(({ key, keys, duration = 'q' }) => {
        keys = key ? [key] : keys;
        const note = new StaveNote({
          keys: keys.map(key => getVexFlowKey(key)),
          duration: String(duration)
        });
        if (note['dots']) {
          note.addDotToAll();
        }
        keys.forEach((key, index) => {
          const accidentals = Note.accidentals(key.replace('/', ''));
          if (accidentals) {
            note.addAccidental(index, new VF.Accidental(accidentals));
          }
        });
        return note;
      });
    allProcessedNotes = allProcessedNotes.concat(processedNotes);
    const beams = VF.Beam.generateBeams(processedNotes, {
      // groups: [new Vex.Flow.Fraction(1, 4), new Vex.Flow.Fraction(1, 2)]
      // this does not really work proficiently => wrong grouping
    });
    Formatter.FormatAndDraw(context, stave, processedNotes);
    beams.forEach(function (b) {
      b.setContext(context).draw();
    });
    allNotes.concat(processedNotes);
  });

  var ties = allProcessedNotes.map((note, index) =>
    !index || !allNotes[index].tie
      ? null
      : new VF.StaveTie({
        first_note: allProcessedNotes[index - 1],
        last_note: allProcessedNotes[index],
        first_indices: [0],
        last_indices: [0]
      })
  );
  ties.forEach(function (t) {
    t && t.setContext(context).draw();
  });
}
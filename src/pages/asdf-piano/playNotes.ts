export default function playNotes(piano, voicing, chord?) {
  const time = "+0.02";
  if (!voicing) {
    console.warn("no voicing for chord", chord);
    return;
  }
  if (chord) {
    piano.pedalUp();
    piano.pedalDown();
    /*const [root] = Chord.tokenize(chord);
    const bassNote = root + "2";
    piano.keyDown({ note: bassNote, velocity: 0.7, time });
    piano.keyUp({ note: bassNote, time: "+0.2" });*/
  }
  voicing?.forEach((note) => {
    piano.keyDown({ note, velocity: 0.5, time });
    piano.keyUp({ note, time: "+0.2" });
  });
}

import { Note, Scale } from '@tonaljs/tonal';
import scaleChroma from './content/components/sets/scaleChroma';

const chroma = scaleChroma('A locrian #2');
chroma;
const { notes } = Scale.get('A locrian #2');
notes;
let i = Note.chroma('A');
i
const step = 7;
const next = () => (i + step) % chroma.length;
i = next();
let d = chroma[i]
d
i = next();
i
d = chroma[i]
d
import { Interval, Chord, Note } from '@tonaljs/tonal';

export class Harmony {
  // mapping for ireal chords to tonal symbols, see getTonalChord
  static irealToTonal = {
    "^7": "M7",
    "7": "7",
    "-7": "m7",
    "h7": "m7b5",
    "7#9": "7#9",
    "7b9": "7b9",
    "^7#5": "M7#5",
    "^#5": "M#5",
    "": "",
    "^": "M",
    "6": "6",
    "9": "9",
    "-6": "m6",
    "o7": "o7",
    "h": "m7b5",
    "-^7": "mM7",
    "o": "o",
    "^9": "M9",
    "7#11": "7#11",
    "7#5": "7#5",
    "-": "m",
    "7sus": "7sus",
    "69": "M69",
    "7b13": "7b13",
    "+": "+",
    "7b9b5": "7b5b9",
    "-9": "m9",
    "9sus": "9sus",
    "7b9sus": "7b9sus",
    "7b9#5": "7#5b9",
    "13": "13",
    "^7#11": "M7#11",
    "-7b5": "m7b5",
    "^13": "M13",
    "7#9b5": "7b5#9",
    "-11": "m11",
    "11": "11",
    "7b5": "7b5",
    "9#5": "9#5",
    "13b9": "13b9",
    "9#11": "9#11",
    "13#11": "13#11",
    "-b6": "mb6",
    "7#9#5": "7#5#9",
    "-69": "m69",
    "13sus": "13sus",
    "^9#11": "M9#11",
    "7b9#9": "7b9#9",
    "sus": "sus",
    "sus4": "Msus4",
    "sus2": "Msus2",
    "7#9#11": "7#9#11",
    "7b9b13": "7b9b13",
    "7b9#11": "7b9#11",
    "13#9": "13#9",
    "9b5": "9b5",
    "-^9": "mM9",
    "2": "Madd9",
    "-#5": "m#5",
    "7+": "7#5",
    "7sus4": "7sus", // own addition
    "M69": "M69", // own addition
    // "5": "5",
    // "7b13sus": "7b13sus",
  };
  static getBassNote(chord: string, ignoreSlash = false) {
    if (!chord) {
      return null;
    }
    if (!ignoreSlash && chord.includes('/')) {
      return chord.split('/')[1];
    }
    const match = chord.match(/^([A-G][b|#]?)/);
    if (!match || !match.length) {
      return '';
    }
    return match[0];
  }
  static tokenizeChord(chord: string) {
    if (!chord) {
      return null;
    }
    const root = Harmony.getBassNote(chord, true) || '';
    let symbol = chord.replace(root, '');
    symbol = symbol.split('/')[0]; // ignore slash
    // check if already a proper tonal chord
    if (!!Object.keys(Harmony.irealToTonal).find(i => Harmony.irealToTonal[i] === symbol)) {
      return root + symbol;
    }
    return [root, symbol];
  }
  static getTonalChord(chord: string) {
    if (!chord) {
      return null;
    }
    const root = Harmony.getBassNote(chord, true) || '';
    let symbol = chord.replace(root, '');
    symbol = symbol.split('/')[0]; // ignore slash
    // check if already a proper tonal chord
    if (!!Object.keys(Harmony.irealToTonal).find(i => Harmony.irealToTonal[i] === symbol)) {
      return root + symbol;
    }
    symbol = Harmony.irealToTonal[symbol];
    if (symbol === undefined) {
      return null;
    }
    return root + symbol;
  }
  /** Returns true if the given degree is present in the intervals */
  static hasDegree(degree, intervals) {
    return !!Harmony.findDegree(degree, intervals);
  }
  static findDegree(degreeOrStep: number | string, intervalsOrSteps: string[]) {
    const intervals = intervalsOrSteps.map(i => Harmony.isInterval(i) ? i : Harmony.getIntervalFromStep(i));
    if (typeof degreeOrStep === 'number') { // is degree
      const degree = Math.abs(degreeOrStep);
      return intervals.find(i => {
        i = Harmony.minInterval(i, 'up');
        if (!steps[i]) {
          console.error('interval', i, 'is not valid', intervals);
        }
        return !!(steps[i].find(step => Harmony.getDegreeFromStep(step) === degree));
      });
    }
    // is step
    const step = Harmony.getStep(degreeOrStep);
    return intervals.find(i => i.includes(step) ||
      i === Harmony.getIntervalFromStep(step));
  }
  // use Interval.ic?
  static minInterval(interval, direction?: intervalDirection, noUnison?) {
    interval = Harmony.fixInterval(interval, true);
    if (direction) {
      return Harmony.forceDirection(interval, direction, noUnison)
    }
    let inversion = Harmony.invertInterval(interval);
    if (Math.abs(Interval.semitones(inversion)) < Math.abs(Interval.semitones(interval))) {
      interval = inversion;
    }
    return interval;
  }
  /** Transforms interval into one octave (octave+ get octaved down) */
  static fixInterval(interval = '', simplify = false) {
    let fix: { [key: string]: string } = {
      '0A': '1P',
      '-0A': '1P',
      /*  */
    }
    if (simplify) {
      fix = {
        ...fix,
        '8P': '1P',
        '-8P': '1P',
        /* '-1A': '-2m',
        '1A': '2m',
        '8d': '7M',
        '-8d': '-7M', */
      }
      interval = Interval.simplify(interval);
    }
    if (Object.keys(fix).includes(interval)) {
      return fix[interval];
    }
    return interval;
  }
  /** inverts the interval if it does not go to the desired direction */
  static forceDirection(interval, direction: intervalDirection, noUnison = false) {
    const semitones = Interval.semitones(interval);
    if ((direction === 'up' && semitones < 0) ||
      (direction === 'down' && semitones > 0)) {
      return Harmony.invertInterval(interval);
    }
    if (interval === '1P' && noUnison) {
      return (direction === 'down' ? '-' : '') + '8P';
    }
    return interval;
  }
  static invertInterval(interval) {
    if (!interval) {
      return null;
    }
    const positive = interval.replace('-', '');
    const complement = Harmony.intervalComplement(positive);
    const isNegative = interval.length > positive.length;
    return (isNegative ? '' : '-') + complement;
  }
  static intervalComplement(interval) {
    const fix = {
      '8P': '1P',
      '8d': '1A',
      '8A': '1d',
      '1A': '8d',
      '1d': '8A',
    }
    const fixIndex = Object.keys(fix).find(key => interval.match(key));
    if (fixIndex) {
      return fix[fixIndex];
    }
    return Interval.invert(interval);
  }
  /** Returns interval from step */
  static getIntervalFromStep(step: string | number) {
    step = Harmony.getStep(step);
    const interval = Object.keys(steps)
      .find(i => steps[i].includes(step));
    if (!interval) {
      // console.warn(`step ${step} has no defined inteval`);
    }
    return interval;
  }
  static getStep(step: string | number) {
    if (typeof step === 'number' && step < 0) {
      step = 'b' + (step * -1);
    }
    return step + ''; // to string
  }
  static isInRange(note, range: string[]) {
    return Interval.semitones(Interval.distance(note, range[0])) <= 0 && Interval.semitones(Interval.distance(note, range[1])) >= 0;
  }
  static noteArray(range) {
    const slots = Interval.semitones(Interval.distance(range[0], range[1]) + '');
    return new Array(slots + 1)
      .fill('')
      .map((v, i) => Note.transpose(range[0], Interval.fromSemitones(i)) + '')
      .map(n => Note.simplify(n))
  }
  static getPitchesInRange(pitches: string[], range: string[]) {
    return Harmony.noteArray(range).filter(n => pitches.find(p => Note.chroma(p) === Note.chroma(n)));
    // return noteArray(range).filter(n => pitches.find(p => Note.pc(p) === Note.pc(n)));
  }
  /** Returns degree from step */
  static getDegreeFromStep(step: string) {
    step = Harmony.getStep(step);
    const match = step.match(/([1-9])+/);
    if (!match || !match.length) {
      return 0;
    }
    return parseInt(match[0], 10);
  }
  static isInterval(interval) {
    return typeof Interval.semitones(interval) === 'number';
  }
  static getDegreeInChord(degree, chord) {
    chord = Harmony.getTonalChord(chord);
    const intervals = Chord.get(chord).intervals;
    const tokens = Chord.tokenize(chord);
    return Note.transpose(tokens[0], Harmony.findDegree(degree, intervals));
  }
  static getStepFromInterval(interval, min = false) {
    const step = steps[interval] || [];
    if (min) {
      return step[1] || step[0] || 0;
    }
    return step[0] || 0;
  }
  static getDegreeFromInterval(interval = '-1', simplify = false) {
    const fixed = Harmony.fixInterval(interval + '', simplify) || '';
    const match = fixed.match(/[-]?([1-9])+/);
    if (!match) {
      return 0;
    }
    return Math.abs(parseInt(match[0], 10));
  }
}
export declare type intervalDirection = 'up' | 'down';

const steps = {
  '1P': ['1', '8'],
  '2m': ['b9', 'b2'],
  '2M': ['9', '2',],
  '2A': ['#9', '#2'],
  '3m': ['b3'],
  '3M': ['3'],
  '4P': ['11', '4'],
  '4A': ['#11', '#4'],
  '5d': ['b5'],
  '5P': ['5'],
  '5A': ['#5'],
  '6m': ['b13', 'b6'],
  '6M': ['13', '6'],
  '7m': ['b7'],
  '7M': ['7', '^7', 'maj7']
};
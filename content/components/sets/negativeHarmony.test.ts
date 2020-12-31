import chordChroma from './chordChroma';
import negativeHarmony from './negativeHarmony';
import scaleChroma from './scaleChroma';

test('negativeHarmony', () => {
  expect(negativeHarmony(scaleChroma('C major'), 'C')).toBe(scaleChroma('C minor'));
  expect(negativeHarmony(chordChroma('C'), 'C')).toBe(chordChroma('Cm'));
  expect(negativeHarmony(chordChroma('G7'), 'C')).toBe(chordChroma('Dm7b5'));
  expect(negativeHarmony(chordChroma('Dm7'), 'C')).toBe(chordChroma('Gm7'));

  expect(negativeHarmony(scaleChroma('D major'), 'D')).toBe(scaleChroma('D minor'));
})
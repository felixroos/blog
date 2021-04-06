import { convertValue, roundDigits, tokenizeValue, normalizeValue } from './components';

test('tokenizeValue', () => {
  expect(tokenizeValue('100k')).toEqual([100, 'k', '']);
  expect(tokenizeValue('0.0047uF')).toEqual([0.0047, 'u', 'F']);
  expect(tokenizeValue('100n')).toEqual([100, 'n', '']);
  expect(tokenizeValue('10uF')).toEqual([10, 'u', 'F']);
  expect(tokenizeValue('33nF')).toEqual([33, 'n', 'F']);
  expect(tokenizeValue('0.1uF')).toEqual([0.1, 'u', 'F']);
  expect(tokenizeValue('22pF')).toEqual([22, 'p', 'F']);
  expect(tokenizeValue('22pF')).toEqual([22, 'p', 'F']);
  expect(tokenizeValue('120k')).toEqual([120, 'k', '']);
  expect(tokenizeValue('120K')).toEqual([120, 'k', '']);
  expect(tokenizeValue('blabla')).toEqual([]);
  expect(tokenizeValue('1k5')).toEqual([1.5, 'k', '']);
  expect(tokenizeValue('4u7')).toEqual([4.7, 'u', '']);
  expect(tokenizeValue('2k2')).toEqual([2.2, 'k', '']);
  expect(tokenizeValue('6K8')).toEqual([6.8, 'k', '']);
})

test('roundDigits', () => {
  expect(roundDigits(4.69999999999999, 5)).toBe(4.7);
})

test('convertValue', () => {
  expect(roundDigits(1e3 / 1e9 * 100, 3)).toEqual(0);
  expect(roundDigits(1e3 / 1e9 * 100, 5)).toEqual(0.0001);
  expect(convertValue(100, 'k', 'G')).toEqual(0.0001);
  expect(convertValue(100, 'k', 'M')).toEqual(0.1);
  expect(convertValue(100, 'k', '')).toEqual(100000);
  expect(convertValue(1.5, 'k', '')).toEqual(1500);
  expect(convertValue(1500, '', 'k')).toEqual(1.5);
  expect(convertValue(0.0047, 'u', 'n')).toEqual(4.7);
  expect(convertValue(0.0047, 'u', 'p')).toEqual(4700);
});

test('normalizeValue', () => {
  expect(normalizeValue('1k')).toEqual('1k');
  expect(normalizeValue('100k')).toEqual('100k');
  expect(normalizeValue('100K')).toEqual('100k');
  expect(normalizeValue('0.0047uF')).toEqual('4.7n');
  expect(normalizeValue('4.7nF')).toEqual('4.7n');
  expect(normalizeValue('4n7F')).toEqual('4.7n');
  expect(normalizeValue('4700pF')).toEqual('4.7n');
})

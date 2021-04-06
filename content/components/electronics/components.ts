const unitMap = {
  'G': 1e9,
  'M': 1e6,
  'k': 1e3,
  'K': 1e3,
  'u': 1e-6,
  'n': 1e-9,
  'p': 1e-12,
  '': 1,
};

export function tokenizeValue(value) {
  // middle char format e.g. 2k2
  let t = value.match(/^\s*(\d+)(G|M|[kK]|u|n|p)(\d+)(.*)$/);
  if (t) {
    return [parseFloat(`${t[1]}.${t[3]}`), (t[2] || '').toLowerCase(), t[4]];
  }
  // decimal format e.g. 2.2k
  t = value.match(/^\s*(\d+(\.\d*)?)(G|M|[kK]|u|n|p)?(.*)$/);
  if (!Array.isArray(t)) {
    return [];
  }
  return [parseFloat(t[1]), (t[3] || '').toLowerCase(), t[4]];
}

export function normalizeValue(val) {
  const [value, prefix, rest] = tokenizeValue(val);
  if (value === 0) {
    return [0, '', rest];
  }
  const values = Object.keys(unitMap).map(p => [convertValue(value, prefix, p), p]);
  const len = (v) => (v[0] + '').replace('.', '..').length;
  // little "hack" to count "." double (e.g 100k is better than 0.1M)
  return values.reduce((best, current) => {
    if (current[0] === 0) {
      return best;
    }
    if (!best || len(current) < len(best)) {
      return current;
    }
    return best;
  }, undefined).join('')
}

export function roundDigits(value, digits) {
  const f = Math.pow(10, digits)
  return Math.round(value * f) / f;
}

export function convertValue(value, from, to, precision = 5) {
  const converted = unitMap[from] / unitMap[to] * value;
  if (precision === Infinity) {
    return converted;
  }
  return roundDigits(converted, precision);
}
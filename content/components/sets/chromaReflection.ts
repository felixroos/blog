export default function chromaReflection(chroma, axis = 0) {
  const c = chroma.split('');
  const p = axis % 12;
  for (let i = 1; i < 6; ++i) {
    const [a, b] = [(i + p) % 12, (12 - i + p) % 12];
    [c[a], c[b]] = [c[b], c[a]];
  }
  return c.join('');
}
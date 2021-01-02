export default function chromaAverage(chroma: string) {
  const digits = chroma.split('');
  const ones = digits.map((d, i) => d === '1' ? i : -1).filter(i => i !== -1);
  const avg = ones.reduce((sum, i) => i + sum, 0) % 12;
  return avg;
}
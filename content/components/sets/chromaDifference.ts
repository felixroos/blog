export default (a, b) => {
  let diff = 0;
  for (let i = 0; i < 12; ++i) {
    diff += a[i] === b[i] ? 0 : 1
  }
  return diff;
}
export default (a, b) => {
  let diff = 0;
  for (let i = 0; i < 12; ++i) {
    diff += a[i] === b[i] ? 0 : 1
  }
  return diff;
}

// export const chromaDifference = (a, b) => ((parseInt(a, 2) ^ parseInt(b, 2)) >>> 0).toString(2).split('1').length - 1;

// old method to get scale colors from chroma..
// return binaryToHexColor(reorderChroma(scaleChroma(scale), 7)); 

export const binaryToHexColor = (binary) => {
  const hex = parseInt(binary, 2).toString(16).toUpperCase();
  const zeroes = new Array(3 - hex.length).fill(0).join('');
  return (
    '#' +
    (zeroes + hex)
      .split('')
      .map((d) => `${d}0`)
      .join('')
  );
};

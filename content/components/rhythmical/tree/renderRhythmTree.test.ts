import renderRhythmTree from './renderRhythmTree';
const simplify = ({ value, time, duration }) => [value, time, duration];

test('renderRhythmTree', () => {
  describe('variable durations', () => {
    expect(renderRhythmTree({
      duration: 8, sequential: [
        [{ value: "C4", duration: 3 }, "D4"],
        ["E4", { value: "D4", duration: 2 }, "B3"]]
    }).map(simplify)).toEqual([
      ['C4', 0, 3],
      ['D4', 3, 1],
      ['E4', 4, 1],
      ['D4', 5, 2],
      ['B3', 7, 1],
    ]);
  })
  describe('nested array', () => {
    expect(renderRhythmTree({
      duration: 9,
      sequential: [
        [
          ['sn', ['sn', 'sn', 'sn']],
          ['sn', ['sn', 'sn', 'sn']],
          ['sn', 'sn'],
        ],
        [
          ['sn', ['sn', 'sn', 'sn']],
          ['sn', ['sn', 'sn', 'sn']],
          [
            ['sn', 'sn', 'sn'],
            ['sn', 'sn', 'sn'],
          ],
        ],
      ]
    }).map(simplify)).toEqual([
      ["sn", 0, 0.75],
      ["sn", 0.75, 0.25],
      ["sn", 1, 0.25],
      ["sn", 1.25, 0.25],
      ["sn", 1.5, 0.75],
      ["sn", 2.25, 0.25],
      ["sn", 2.5, 0.25],
      ["sn", 2.75, 0.25],
      ["sn", 3, 0.75],
      ["sn", 3.75, 0.75],
      ["sn", 4.5, 0.75],
      ["sn", 5.25, 0.25],
      ["sn", 5.5, 0.25],
      ["sn", 5.75, 0.25],
      ["sn", 6, 0.75],
      ["sn", 6.75, 0.25],
      ["sn", 7, 0.25],
      ["sn", 7.25, 0.25],
      ["sn", 7.5, 0.25],
      ["sn", 7.75, 0.25],
      ["sn", 8, 0.25],
      ["sn", 8.25, 0.25],
      ["sn", 8.5, 0.25],
      ["sn", 8.75, 0.25]
    ])
  });

  describe('polyphony', () => {
    expect(renderRhythmTree({
      duration: 4,
      parallel: [
        ['C', ['D', 'E']],
        ['E', ['G', 'B']],
      ]
    }).map(simplify)).toEqual([
      ['C', 0, 2],
      ['D', 2, 1],
      ['E', 3, 1],
      ['E', 0, 2],
      ['G', 2, 1],
      ['B', 3, 1],
    ])
  })
})

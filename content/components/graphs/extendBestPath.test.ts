import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import extendBestPath from './extendBestPath'

test('extendBestPath', () => {
  const candidates = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C major', 'C lydian']];
  const getValue = ({ path }, candidate) => {
    return chromaDifference(scaleChroma(path[path.length - 1]), scaleChroma(candidate))
  };
  const step1 = [
    {
      path: ["D aeolian"],
      value: 0,
      values: [0],
    },
    {
      path: ["D dorian"],
      value: 0,
      values: [0],
    },
  ];
  expect(extendBestPath([], candidates, getValue)).toEqual(step1);
  const step2 = [
    {
      path: ["D aeolian", "G mixolydian"],
      value: 2,
      values: [0, 2],
    }
    , step1[1]];
  expect(extendBestPath(step1, candidates, getValue)).toEqual(step2);
  const step3 = [
    step2[0],
    {
      path: ["D dorian", "G mixolydian"],
      value: 0,
      values: [0, 0],
    }];
  expect(extendBestPath(step2, candidates, getValue)).toEqual(step3);
  const step4 = [
    step2[0], {
      path: ["D dorian", "G mixolydian", "C major"],
      value: 0,
      values: [0, 0, 0],
    },
    {
      path: ["D dorian", "G mixolydian", "C lydian"],
      value: 2,
      values: [0, 0, 2],
    }]
  expect(extendBestPath(step3, candidates, getValue)).toEqual(step4);
  expect(() => extendBestPath(step4, candidates, getValue)).toThrowError();
})

// TODO: use this function in a loop
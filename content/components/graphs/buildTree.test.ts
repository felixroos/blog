import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import buildTree from './buildTree'

test('buildTree', () => {
  const scaleDifference = (source, target) =>
    chromaDifference(scaleChroma(source), scaleChroma(target)) / 2;
  const step1 = [
    {
      path: ['D aeolian'],
      value: 0,
    },
    {
      path: ['D dorian'],
      value: 0,
    },
  ]
  expect(buildTree(step1, scaleDifference)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '1.0:D dorian', label: 'D dorian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian' },
      { source: '0', target: '1.0:D dorian' },
    ]
  });


  const step2 = [
    {
      path: ["D aeolian", "G mixolydian"],
      value: 2,
      values: [0, 2],
    }
    , step1[1]]

  expect(buildTree(step2, scaleDifference)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '0.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.0:D dorian', label: 'D dorian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian' },
      { source: '0.0:D aeolian', target: '0.1:G mixolydian' },
      { source: '0', target: '1.0:D dorian' },
    ]
  })

  const step3 = [
    step2[0],
    {
      path: ["D dorian", "G mixolydian"],
      value: 0,
      values: [0, 0],
    }];

  expect(buildTree(step3, scaleDifference)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '0.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.0:D dorian', label: 'D dorian' },
      { id: '1.1:G mixolydian', label: 'G mixolydian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian' },
      { source: '0.0:D aeolian', target: '0.1:G mixolydian' },
      { source: '0', target: '1.0:D dorian' },
      { source: '1.0:D dorian', target: '1.1:G mixolydian' },
    ]
  })

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
    }];

  expect(buildTree(step4, scaleDifference)).toEqual({
    nodes: [
      { id: '0', label: 'start' },
      { id: '0.0:D aeolian', label: 'D aeolian' },
      { id: '0.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.0:D dorian', label: 'D dorian' },
      { id: '1.1:G mixolydian', label: 'G mixolydian' },
      { id: '1.2:C major', label: 'C major' },
      { id: '2.2:C lydian', label: 'C lydian' },
    ],
    edges: [
      { source: '0', target: '0.0:D aeolian' },
      { source: '0.0:D aeolian', target: '0.1:G mixolydian' },
      { source: '0', target: '1.0:D dorian' },
      { source: '1.0:D dorian', target: '1.1:G mixolydian' },
      { source: '1.1:G mixolydian', target: '1.2:C major' },
      { source: '0', target: '1.0:D dorian' },
      { source: '1.0:D dorian', target: '1.1:G mixolydian' },
      { source: '1.1:G mixolydian', target: '2.2:C lydian' },
    ]
  })
})

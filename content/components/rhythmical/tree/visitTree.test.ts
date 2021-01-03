import { visitTree } from './visitTree';

function leafIndices(hierarchy) {
  const path = [];
  const paths = [];
  visitTree(
    hierarchy,
    (t, i) => i >= 0 && path.push(i) && !Array.isArray(t) && paths.push([...path]),
    (_, i) => i >= 0 && path.pop(),
    (node) => (Array.isArray(node) ? node : [])
  )
  return paths;
}
export function leafPositions(hierarchy) {
  const path = [];
  const paths = [];
  visitTree(
    hierarchy,
    (t, i, children) => i >= 0 && path.push([i, children.length]) && !Array.isArray(t) && paths.push([...path]),
    (_, i) => i >= 0 && path.pop(),
    (node) => (Array.isArray(node) ? node : undefined)
  );
  return paths;
}

test('leafIndices', () => {
  expect(leafIndices(['A', [['B', 'C'], 'D']])).toEqual([[0], [1, 0, 0], [1, 0, 1], [1, 1]]);
  expect(
    leafIndices([
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
    ])
  ).toEqual([
    [0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 2],
    [0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [0, 1, 1, 2],
    [0, 2, 0],
    [0, 2, 1],
    [1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 1],
    [1, 0, 1, 2],
    [1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 2],
    [1, 2, 0, 0],
    [1, 2, 0, 1],
    [1, 2, 0, 2],
    [1, 2, 1, 0],
    [1, 2, 1, 1],
    [1, 2, 1, 2],
  ]);
});

test('leafPositions', () => {
  expect(
    leafPositions([
      [
        ['sn', ['sn', 'sn', 'sn']],
        ['sn', ['sn', 'sn', 'sn']],
        ['sn', 'sn'],
      ],
      [
        ['sn', ['sn', 'sn', 'sn']],
        ['sn', ['sn', 'sn', 'sn']],
        [['sn', 'sn', 'sn'], ['sn', 'sn', 'sn']],
      ],
    ])
  ).toEqual([
    [[0, 2], [0, 3], [0, 2]],
    [[0, 2], [0, 3], [1, 2], [0, 3]],
    [[0, 2], [0, 3], [1, 2], [1, 3]],
    [[0, 2], [0, 3], [1, 2], [2, 3]],
    [[0, 2], [1, 3], [0, 2]],
    [[0, 2], [1, 3], [1, 2], [0, 3]],
    [[0, 2], [1, 3], [1, 2], [1, 3]],
    [[0, 2], [1, 3], [1, 2], [2, 3]],
    [[0, 2], [2, 3], [0, 2]],
    [[0, 2], [2, 3], [1, 2]],
    [[1, 2], [0, 3], [0, 2]],
    [[1, 2], [0, 3], [1, 2], [0, 3]],
    [[1, 2], [0, 3], [1, 2], [1, 3]],
    [[1, 2], [0, 3], [1, 2], [2, 3]],
    [[1, 2], [1, 3], [0, 2]],
    [[1, 2], [1, 3], [1, 2], [0, 3]],
    [[1, 2], [1, 3], [1, 2], [1, 3]],
    [[1, 2], [1, 3], [1, 2], [2, 3]],
    [[1, 2], [2, 3], [0, 2], [0, 3]],
    [[1, 2], [2, 3], [0, 2], [1, 3]],
    [[1, 2], [2, 3], [0, 2], [2, 3]],
    [[1, 2], [2, 3], [1, 2], [0, 3]],
    [[1, 2], [2, 3], [1, 2], [1, 3]],
    [[1, 2], [2, 3], [1, 2], [2, 3]],
  ]);
});
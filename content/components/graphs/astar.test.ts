import scaleDifference from '../sets/scaleDifference';
import astar, { Target } from './astar';

test('astar', () => {

  const graph = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C lydian', 'C major']];
  const getNodeID = (level, scale) => `${level}.${scale}`;
  const scaleTargets = (graph) => (nodeID) => {
    const [lvl, source] = nodeID.split('.');
    const level = parseInt(lvl);
    if (level >= graph.length - 1) {
      return [];
    }
    return graph[level + 1].map((target): Target => [
      getNodeID(level + 1, target),
      scaleDifference(source, target)
    ])
  }
  expect(getNodeID(0, 'D dorian')).toBe('0.D dorian');

  expect(scaleTargets(graph)('1.G mixolydian')).toEqual([['2.C lydian', 2], ['2.C major', 0]]);

  const start = graph[0].map(scale => getNodeID(0, scale));
  const lastLvl = graph.length - 1;
  const end = graph[lastLvl].map(scale => getNodeID(lastLvl, scale));

  expect(astar(start, end, scaleTargets(graph))).toEqual(['0.D dorian', '1.G mixolydian', '2.C major']);

  const scalePath = (choices) => astar(
    choices[0].map(scale => getNodeID(0, scale)),
    choices[choices.length - 1].map(scale => getNodeID(choices.length - 1, scale)),
    scaleTargets(choices)
  ).map(node => node.split('.')[1])

  expect(scalePath(graph)).toEqual(['D dorian', 'G mixolydian', 'C major']);
  expect(scalePath([['D major']])).toEqual(['D major']);
  expect(scalePath([['D major'], ['D major', 'Db major']])).toEqual(['D major', 'D major']);

})
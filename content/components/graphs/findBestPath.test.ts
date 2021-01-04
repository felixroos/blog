import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import findBestPath from './findBestPath'

test('findBestPath', () => {
  const graph = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C major', 'C lydian']];
  const getValue = ({ path }, candidate) => {
    return chromaDifference(scaleChroma(path[path.length - 1]), scaleChroma(candidate))
  };
  expect(findBestPath(graph, getValue)).toEqual(['D dorian', 'G mixolydian', 'C major'])
})
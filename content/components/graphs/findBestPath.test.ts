import chromaDifference from '../sets/chromaDifference';
import scaleChroma from '../sets/scaleChroma';
import findBestPath from './findBestPath'

test('findBestPath', () => {
  const graph1 = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C major', 'C lydian']];
  const getValue = (source, target) => {
    return chromaDifference(scaleChroma(source), scaleChroma(target))
  };
  expect(findBestPath(graph1, getValue)).toEqual(['D dorian', 'G mixolydian', 'C major']);
  const graph2 = [['D aeolian', 'D dorian'], ['G mixolydian'], ['C major', 'C lydian'], ['C aeolian', 'C dorian'], ['F mixolydian'], ['Bb major', 'Bb lydian']];
  expect(findBestPath(graph2, getValue)).toEqual(['D dorian', 'G mixolydian', 'C major', 'C dorian', 'F mixolydian', 'Bb major']);
})
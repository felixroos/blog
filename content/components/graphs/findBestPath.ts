import { minIndex } from 'd3-array';
import extendBestPath from './extendBestPath';

export default function findBestPath(graph, getValue) {
  let paths = [];
  let isFinished = false;
  while (!isFinished) {
    const extended = extendBestPath(paths, graph, getValue);
    if (!extended) {
      isFinished = true
    } else {
      paths = extended;
    }
  }
  const best = paths[minIndex(paths, (path) => path.value)];
  return best.path;
}
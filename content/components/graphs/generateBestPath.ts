import { minIndex } from 'd3-array';
import extendBestPath, { ValueFn, Path } from './extendBestPath';

export default function* generateBestPath(graph: string[][], getValue: ValueFn, options = {}) {
  const { onlyKeepWinner } = {
    onlyKeepWinner: false, ...options
  };
  let paths: Path[] = [];
  let isFinished = false;
  let extensions = [];

  while (!isFinished) {
    const extended = extendBestPath(paths, graph, getValue, extensions);
    if (!extended) {
      isFinished = true;
    } else {
      paths = extended;
      yield paths;
    }
  }
  if (onlyKeepWinner) {
    return [paths[minIndex(paths, (path) => path.value)]];
  }
  return paths;
}

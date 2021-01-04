import { minIndex } from 'd3-array';

declare type Path = {
  values: number[],
  value: number,
  path: string[]
}

declare type ValueFn = (path: Path, target: string,) => number;

export default function extendBestPath(paths: Path[], graph: string[][], getValue: ValueFn): Path[] | false {
  if (!paths.length) {
    // if no paths are given, return initial paths
    return graph[0].map(candidate => ({ value: 0, values: [0], path: [candidate] }))
  }
  // find index with lowest value
  const bestIndex = minIndex(paths, (path) => path.value);
  const best = paths[bestIndex];
  if (best.path.length >= graph.length) {
    // throw error if the best path is already at the end => cannot extend any further
    // throw new Error('cannot extendBestPath: graph end reached');
    return false;
  }
  // generate next possible steps by splitting up the best path for all possible next candidates
  const nextSteps: Path[] = graph[best.path.length].map(candidate => {
    const value = getValue(best, candidate);
    return {
      value: best.value + value,
      values: best.values.concat([value]),
      path: best.path.concat(candidate)
    }
  });
  // replace best path with nextSteps
  return paths.slice(0, bestIndex).concat(nextSteps, paths.slice(bestIndex + 1));
  // now using concat for performance boost
  // return [...paths.slice(0, bestIndex), ...nextSteps, ...paths.slice(bestIndex + 1)]
}